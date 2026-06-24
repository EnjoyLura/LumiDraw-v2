// 首页
const util = require('../../utils/util');

const CARD_COLORS = [
  'linear-gradient(135deg, #a8d8f8, #b0e6d0)',
  'linear-gradient(135deg, #FFD4C8, #FFC8D6)',
  'linear-gradient(135deg, #D4C8F0, #B8A8E0)',
  'linear-gradient(135deg, #A3E4CC, #8BD8B8)',
  'linear-gradient(135deg, #FFC8A8, #FFB090)',
  'linear-gradient(135deg, #C8D8F8, #A8C0F0)',
  'linear-gradient(135deg, #F0C8D8, #E8B0C8)',
  'linear-gradient(135deg, #D8E8C8, #C0D8B0)'
];

function getMockWorks(tab) {
  const works = [];
  const titles = ['霓虹都市','山水之间','少女与猫','抽象梦境','古风少女','赛博精灵','水彩猫咪','极简几何'];
  const users = [
    { n: '星辰大海', t: '星', c: '#6FD4B0' },
    { n: '月光如水', t: '月', c: '#FFB59A' },
    { n: '风之绘师', t: '风', c: '#B8A5E3' },
    { n: '光影魔术', t: '光', c: '#FFE08A' }
  ];
  for (let i = 0; i < 8; i++) {
    const u = users[i % users.length];
    works.push({
      id: 100 + i, imageUrl: '', title: titles[i],
      prompt: titles[i] + '的精彩创作',
      userId: 'u' + (i % 4 + 1),
      ratio: ['3:4', '4:3', '1:1', '9:16'][i % 4],
      status: 'published',
      likes: Math.floor(Math.random() * 800) + 50,
      _userName: u.n, _userAvatarText: u.t, _userColor: u.c,
      _cardColor: CARD_COLORS[i % CARD_COLORS.length]
    });
  }
  if (tab === 'new') works.reverse();
  return works;
}

Page({
  data: {
    banners: [
      { id: 1, title: '夏日创作季', color: 'linear-gradient(135deg, #FF9A56, #FF6B8A)' },
      { id: 2, title: '新模型上线', color: 'linear-gradient(135deg, #5B9FE8, #B8A5E3)' },
      { id: 3, title: '会员特惠', color: 'linear-gradient(135deg, #B8A5E3, #FFD700)' },
      { id: 4, title: '社区精选', color: 'linear-gradient(135deg, #6FD4B0, #5B9FE8)' }
    ],
    bannerIndex: 0,
    gameplays: [
      { name: '人物美颜', color: 'linear-gradient(135deg, #FFB3C1, #FF8FA3)' },
      { name: '证件照', color: 'linear-gradient(135deg, #a8d8f8, #b0e6d0)' },
      { name: '宠物头像', color: 'linear-gradient(135deg, #FFD4C8, #FFC8D6)' },
      { name: '古风国潮', color: 'linear-gradient(135deg, #D4C8F0, #B8A8E0)' },
      { name: 'Q版头像', color: 'linear-gradient(135deg, #A3E4CC, #8BD8B8)' },
      { name: 'Logo设计', color: 'linear-gradient(135deg, #FFC8A8, #FFB090)' },
      { name: '壁纸', color: 'linear-gradient(135deg, #C8D8F8, #A8C0F0)' },
      { name: '表情包', color: 'linear-gradient(135deg, #F0C8D8, #E8B0C8)' }
    ],
    currentTab: 'recommend',
    works: [],
    likedMap: {},
    loadMoreStatus: 'hidden',
    showSkeleton: true,
    showTabLoading: false,
    wfAnimClass: ''
  },

  onLoad() {
    this._loadData();
    this._startBannerTimer();
  },

  onUnload() {
    if (this._bannerTimer) clearInterval(this._bannerTimer);
  },

  _loadData() {
    this.setData({ showSkeleton: true });
    setTimeout(() => {
      this.setData({
        works: getMockWorks('recommend'),
        showSkeleton: false,
        loadMoreStatus: 'noMore'
      });
    }, 800);
  },

  _startBannerTimer() {
    this._bannerTimer = setInterval(() => {
      const next = (this.data.bannerIndex + 1) % this.data.banners.length;
      this.setData({ bannerIndex: next });
    }, 4000);
  },

  onBannerChange(e) {
    this.setData({ bannerIndex: e.detail.current });
  },

  onBannerTap(e) {
    const idx = e.currentTarget.dataset.index;
    const banner = this.data.banners[idx];
    if (banner.id === 1) wx.switchTab({ url: '/pages/create/index' });
    else if (banner.id === 2) wx.navigateTo({ url: '/pages/allModels/index' });
    else if (banner.id === 3) wx.navigateTo({ url: '/pages/membership/index' });
    else wx.switchTab({ url: '/pages/plaza/index' });
  },

  onGameplayTap(e) {
    const name = e.currentTarget.dataset.name;
    wx.switchTab({ url: '/pages/create/index' });
    util.showToast('已套用「' + name + '」模板');
  },

  onViewAllGameplays() {
    wx.navigateTo({ url: '/pages/allGameplays/index' });
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    this.setData({ currentTab: tab, showTabLoading: true, wfAnimClass: '' });
    const dir = (tab === 'new' && this.data.currentTab === 'recommend') ? 'left' : 'right';
    setTimeout(() => {
      this.setData({
        works: getMockWorks(tab),
        showTabLoading: false,
        loadMoreStatus: 'noMore',
        wfAnimClass: dir === 'left' ? 'wf-slide-left' : 'wf-slide-right'
      });
      setTimeout(() => this.setData({ wfAnimClass: '' }), 450);
    }, 300);
  },

  onWorkItemTap(e) {
    wx.navigateTo({ url: '/pages/workDetail/index?id=' + e.detail.id });
  },

  onWorkLikeTap(e) {
    const id = e.detail.id;
    const likedMap = Object.assign({}, this.data.likedMap);
    likedMap[id] = !likedMap[id];
    const works = this.data.works.map(w => {
      if ((w.id || w._id) === id) {
        return Object.assign({}, w, { likes: w.likes + (likedMap[id] ? 1 : -1) });
      }
      return w;
    });
    this.setData({ likedMap, works });
  },

  onWorkLongPress(e) {
    util.showToast('长按操作');
  }
});
