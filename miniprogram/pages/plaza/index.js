// 广场页
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
  const titles = ['霓虹都市','山水之间','少女与猫','抽象梦境','古风少女','赛博精灵','水彩猫咪','极简几何','暗黑天使','蒸汽城市','油画风景','像素冒险'];
  const users = [{n:'星辰大海',t:'星',c:'#6FD4B0'},{n:'月光如水',t:'月',c:'#FFB59A'},{n:'风之绘师',t:'风',c:'#B8A5E3'},{n:'光影魔术',t:'光',c:'#FFE08A'}];
  for (let i = 0; i < 12; i++) {
    const u = users[i % users.length];
    works.push({
      id: 200 + i, imageUrl: '', title: titles[i],
      prompt: titles[i] + '的精彩创作',
      userId: 'u' + (i % 4 + 1),
      ratio: ['3:4','4:3','1:1','9:16'][i % 4],
      status: 'published',
      likes: Math.floor(Math.random() * 800) + 50,
      _userName: u.n, _userAvatarText: u.t, _userColor: u.c,
      _cardColor: CARD_COLORS[i % CARD_COLORS.length]
    });
  }
  if (tab === 'new') works.reverse();
  if (tab === 'hot') works.sort((a, b) => b.likes - a.likes);
  return works;
}

Page({
  data: {
    currentTab: 'recommend',
    tabList: [
      { key: 'recommend', label: '推荐' },
      { key: 'hot', label: '热门' },
      { key: 'new', label: '最新' }
    ],
    categories: ['全部','二次元','风景','建筑','表情包','写实','国风','人像','动物','抽象'],
    currentCategory: 0,
    works: [],
    likedMap: {},
    loadMoreStatus: 'hidden',
    showTabLoading: false,
    wfAnimClass: '',
    showLeftDrawer: false,
    showFilterSheet: false,
    filterModels: ['GPT Image 2', 'Nano Banana 2', 'Nano Banana Pro', 'Seedream 4.5'],
    filterRatios: ['1:1', '3:4', '4:3', '16:9', '9:16'],
    filterQualities: ['全高清1K', '超清2K', '超高清4K'],
    selectedFilterModels: [],
    selectedFilterRatios: [],
    selectedFilterQualities: [],
    genTasks: []
  },

  onLoad() { this._loadWorks('recommend'); },
  onShow() {
    const app = getApp();
    this.setData({
      genTasks: app.globalData.generatingTasks || [],
      tabEnterClass: 'tab-page-enter'
    });
    setTimeout(() => this.setData({ tabEnterClass: '' }), 350);
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    const tabOrder = { recommend: 0, hot: 1, new: 2 };
    const dir = tabOrder[tab] > tabOrder[this.data.currentTab] ? 'left' : 'right';
    this.setData({ currentTab: tab, showTabLoading: true, wfAnimClass: '' });
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

  _loadWorks(tab) {
    this.setData({ showTabLoading: true, loadMoreStatus: 'hidden' });
    setTimeout(() => {
      this.setData({ works: getMockWorks(tab), showTabLoading: false, loadMoreStatus: 'noMore' });
    }, 300);
  },

  onCategoryTap(e) {
    this.setData({ currentCategory: parseInt(e.currentTarget.dataset.index) });
    this._loadWorks(this.data.currentTab);
  },

  onOpenLeftDrawer() { this.setData({ showLeftDrawer: true }); },
  onCloseLeftDrawer() { this.setData({ showLeftDrawer: false }); },
  onOpenFilter() { this.setData({ showFilterSheet: true }); },
  onCloseFilter() { this.setData({ showFilterSheet: false }); },
  onSearchTap() { wx.navigateTo({ url: '/pages/search/index' }); },
  onDrawerNav(e) {
    const page = e.currentTarget.dataset.page;
    this.setData({ showLeftDrawer: false });
    if (page === 'create') wx.switchTab({ url: '/pages/create/index' });
    else wx.navigateTo({ url: '/pages/' + page + '/index' });
  },

  onFilterModelTap(e) {
    const val = e.currentTarget.dataset.value;
    const arr = this.data.selectedFilterModels.slice();
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
    this.setData({ selectedFilterModels: arr });
  },
  onFilterRatioTap(e) {
    const val = e.currentTarget.dataset.value;
    const arr = this.data.selectedFilterRatios.slice();
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
    this.setData({ selectedFilterRatios: arr });
  },
  onFilterQualityTap(e) {
    const val = e.currentTarget.dataset.value;
    const arr = this.data.selectedFilterQualities.slice();
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
    this.setData({ selectedFilterQualities: arr });
  },
  onResetFilter() {
    this.setData({ selectedFilterModels: [], selectedFilterRatios: [], selectedFilterQualities: [] });
  },
  onApplyFilter() {
    this.setData({ showFilterSheet: false });
    this._loadWorks(this.data.currentTab);
  },

  onWorkItemTap(e) { wx.navigateTo({ url: '/pages/workDetail/index?id=' + e.detail.id }); },
  onWorkUserTap(e) { wx.navigateTo({ url: '/pages/userProfile/index?userId=' + e.detail.userId }); },
  onWorkLikeTap(e) {
    const id = e.detail.id;
    const likedMap = Object.assign({}, this.data.likedMap);
    likedMap[id] = !likedMap[id];
    const works = this.data.works.map(w => {
      if ((w.id || w._id) === id) return Object.assign({}, w, { likes: w.likes + (likedMap[id] ? 1 : -1) });
      return w;
    });
    this.setData({ likedMap, works });
  },
  onWorkLongPress() { util.showToast('长按操作'); }
});
