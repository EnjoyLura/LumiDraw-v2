// 搜索页
const util = require('../../utils/util');

const HOT_SEARCHES = ['赛博朋克', '古风少女', '证件照', '宠物头像', '二次元', '国风山水', 'Logo设计', '表情包'];

const CARD_COLORS = [
  'linear-gradient(135deg, #a8d8f8, #b0e6d0)',
  'linear-gradient(135deg, #FFD4C8, #FFC8D6)',
  'linear-gradient(135deg, #D4C8F0, #B8A8E0)',
  'linear-gradient(135deg, #A3E4CC, #8BD8B8)'
];

Page({
  data: {
    keyword: '',
    searchHistory: ['梦幻城堡', '猫咪水彩', '日落风景'],
    hotSearches: HOT_SEARCHES,
    showResult: false,
    results: [],
    likedMap: {}
  },

  onInput(e) {
    const val = e.detail.value;
    this.setData({ keyword: val });
    if (val.trim()) {
      this._doSearch(val.trim());
    } else {
      this.setData({ showResult: false });
    }
  },

  onSearch() {
    if (!this.data.keyword.trim()) return;
    this._doSearch(this.data.keyword.trim());
  },

  onHotTap(e) {
    const kw = e.currentTarget.dataset.kw;
    this.setData({ keyword: kw });
    this._doSearch(kw);
  },

  onHistoryTap(e) {
    const kw = e.currentTarget.dataset.kw;
    this.setData({ keyword: kw });
    this._doSearch(kw);
  },

  onClearHistory() {
    this.setData({ searchHistory: [] });
    util.showToast('已清空搜索历史');
  },

  _doSearch(kw) {
    const mockResults = [];
    for (let i = 0; i < 6; i++) {
      mockResults.push({
        id: 300 + i,
        imageUrl: '',
        title: kw + ' 作品' + (i + 1),
        prompt: kw + '相关的创作',
        userId: 'u' + (i % 3 + 1),
        ratio: ['3:4', '4:3', '1:1'][i % 3],
        status: 'published',
        likes: Math.floor(Math.random() * 500) + 50,
        _userName: ['星辰大海', '月光如水', '风之绘师'][i % 3],
        _userAvatarText: ['星', '月', '风'][i % 3],
        _userColor: ['#6FD4B0', '#FFB59A', '#B8A5E3'][i % 3],
        _cardColor: CARD_COLORS[i % CARD_COLORS.length]
      });
    }
    this.setData({ showResult: true, results: mockResults });
  },

  onWorkItemTap(e) {
    const id = e.detail.id;
    wx.navigateTo({ url: '/pages/workDetail/index?id=' + id });
  },

  onWorkLikeTap(e) {
    const id = e.detail.id;
    const likedMap = Object.assign({}, this.data.likedMap);
    likedMap[id] = !likedMap[id];
    this.setData({ likedMap: likedMap });
  }
});
