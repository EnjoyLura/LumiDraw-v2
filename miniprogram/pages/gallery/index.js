// 画廊页
const util = require('../../utils/util');

const CARD_COLORS = [
  'linear-gradient(135deg, #a8d8f8, #b0e6d0)',
  'linear-gradient(135deg, #FFD4C8, #FFC8D6)',
  'linear-gradient(135deg, #D4C8F0, #B8A8E0)',
  'linear-gradient(135deg, #A3E4CC, #8BD8B8)',
  'linear-gradient(135deg, #FFC8A8, #FFB090)'
];

const MOCK_USER = {
  nickName: '云端造梦师',
  userId: 'LUMI8829',
  avatarText: '梦',
  avatarColor: '#5B9FE8',
  gender: 'female',
  signature: '用AI描绘心中的梦境，每一笔都是想象力的延伸',
  worksCount: 48,
  followersCount: 326,
  likesCount: 1200,
  tag: '✦ AI创作者'
};

function getMockWorks(filter) {
  const allWorks = [];
  const titles = ['霓虹都市','山水之间','少女与猫','抽象梦境','古风少女','赛博精灵','水彩猫咪','极简几何'];
  const statuses = ['published','published','published','published','published','draft','draft','draft'];
  for (let i = 0; i < 8; i++) {
    allWorks.push({
      id: 200 + i, imageUrl: '', title: titles[i],
      prompt: titles[i] + '的精彩创作',
      userId: 'self',
      ratio: ['3:4','4:3','1:1','9:16'][i % 4],
      status: statuses[i],
      likes: Math.floor(Math.random() * 500) + 50,
      _userName: MOCK_USER.nickName,
      _userAvatarText: MOCK_USER.avatarText,
      _userColor: MOCK_USER.avatarColor,
      _cardColor: CARD_COLORS[i % CARD_COLORS.length]
    });
  }
  if (filter === 'published') return allWorks.filter(w => w.status === 'published');
  if (filter === 'draft') return allWorks.filter(w => w.status === 'draft');
  if (filter === 'favorite') return allWorks.slice(0, 3);
  return allWorks;
}

const BG_COLORS = [
  { name: '默认', value: '#EEF4FC' },
  { name: '天蓝', value: '#E8F4FD' },
  { name: '薄荷', value: '#E6F7F0' },
  { name: '薰衣草', value: '#F0EBF8' },
  { name: '蜜桃', value: '#FFF0EB' },
  { name: '柠檬', value: '#FFF8E1' },
  { name: '银灰', value: '#F0F2F5' },
  { name: '浅粉', value: '#FFF0F3' },
  { name: '奶茶', value: '#F5F0EB' },
  { name: '冰蓝', value: '#EDF5FF' }
];

const BG_GRADIENTS = [
  { name: '晨曦', value: 'linear-gradient(180deg, #FCEABB, #F8B500 10%, #FCE4EC 40%, #E8F4FD)' },
  { name: '薄暮', value: 'linear-gradient(180deg, #E8D5F5, #F0E6FA 30%, #EEF2FF)' },
  { name: '海风', value: 'linear-gradient(180deg, #D6EAF8, #E8F8F5 50%, #EAF2E3)' },
  { name: '晚霞', value: 'linear-gradient(180deg, #FCE4EC, #FFF3E0 50%, #FFF8E1)' }
];

Page({
  data: {
    user: MOCK_USER,
    currentTab: 'all',
    tabList: [
      { key: 'all', label: '全部' },
      { key: 'published', label: '已发布' },
      { key: 'draft', label: '草稿箱' },
      { key: 'favorite', label: '收藏' }
    ],
    works: [],
    likedMap: {},
    loadMoreStatus: 'hidden',
    manageMode: false,
    selectedItems: {},
    selectedCount: 0,
    headerBg: '',
    showBgPicker: false,
    bgColors: BG_COLORS,
    bgGradients: BG_GRADIENTS,
    currentBgValue: '#EEF4FC',
    showLeftDrawer: false,
    genTasks: []
  },

  onLoad() { this._loadWorks('all'); },

  onShow() {
    const app = getApp();
    this.setData({ genTasks: app.globalData.generatingTasks || [] });
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    this.setData({ currentTab: tab, manageMode: false, selectedItems: {}, selectedCount: 0 });
    this._loadWorks(tab);
  },

  _loadWorks(filter) {
    this.setData({ loadMoreStatus: 'loading' });
    setTimeout(() => {
      this.setData({ works: getMockWorks(filter), loadMoreStatus: 'noMore' });
    }, 300);
  },

  onToggleManage() {
    const manage = !this.data.manageMode;
    this.setData({ manageMode: manage, selectedItems: {}, selectedCount: 0 });
  },

  onSelectItem(e) {
    const id = e.detail ? e.detail.id : e.currentTarget.dataset.id;
    const selected = Object.assign({}, this.data.selectedItems);
    if (selected[id]) delete selected[id];
    else selected[id] = true;
    this.setData({ selectedItems: selected, selectedCount: Object.keys(selected).length });
  },

  onSelectAll() {
    const allSelected = this.data.selectedCount === this.data.works.length;
    const selected = {};
    if (!allSelected) {
      this.data.works.forEach(w => { selected[w.id || w._id] = true; });
    }
    this.setData({ selectedItems: selected, selectedCount: Object.keys(selected).length });
  },

  onDeleteSelected() {
    if (this.data.selectedCount === 0) { util.showToast('请先选择要删除的作品'); return; }
    wx.showModal({
      title: '确认删除', content: '确定要删除选中的 ' + this.data.selectedCount + ' 个作品吗？',
      confirmColor: '#FF6B8A',
      success: (res) => {
        if (res.confirm) {
          util.showToast('已删除 ' + this.data.selectedCount + ' 个作品');
          this.setData({ manageMode: false, selectedItems: {}, selectedCount: 0 });
          this._loadWorks(this.data.currentTab);
        }
      }
    });
  },

  onOpenBgPicker() { this.setData({ showBgPicker: true }); },
  onCloseBgPicker() { this.setData({ showBgPicker: false }); },
  onSelectBgColor(e) {
    this.setData({ headerBg: e.currentTarget.dataset.value, currentBgValue: e.currentTarget.dataset.value, showBgPicker: false });
    util.showToast('背景已更换');
  },
  onSelectBgGradient(e) {
    this.setData({ headerBg: e.currentTarget.dataset.value, currentBgValue: e.currentTarget.dataset.value, showBgPicker: false });
    util.showToast('背景已更换');
  },

  onOpenLeftDrawer() { this.setData({ showLeftDrawer: true }); },
  onCloseLeftDrawer() { this.setData({ showLeftDrawer: false }); },
  onDrawerNav(e) {
    const page = e.currentTarget.dataset.page;
    const type = e.currentTarget.dataset.type || '';
    this.setData({ showLeftDrawer: false });
    if (page === 'create') wx.switchTab({ url: '/pages/create/index' });
    else if (page === 'followList') wx.navigateTo({ url: '/pages/followList/index?type=' + type });
    else wx.navigateTo({ url: '/pages/' + page + '/index' });
  },

  onSearchTap() { wx.navigateTo({ url: '/pages/search/index' }); },
  onEditProfile() { wx.navigateTo({ url: '/pages/editProfile/index' }); },
  onPublish() { wx.navigateTo({ url: '/pages/publish/index' }); },
  onChangeAvatar() { util.showToast('更换头像'); },

  onWorkItemTap(e) {
    const id = e.detail.id;
    if (this.data.manageMode) this.onSelectItem({ currentTarget: { dataset: { id } } });
    else wx.navigateTo({ url: '/pages/workDetail/index?id=' + id });
  },
  onWorkLikeTap(e) {
    const id = e.detail.id;
    const likedMap = Object.assign({}, this.data.likedMap);
    likedMap[id] = !likedMap[id];
    this.setData({ likedMap });
  },
  onWorkLongPress() { util.showToast('长按操作'); }
});
