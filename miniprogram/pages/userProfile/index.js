// 用户主页
const util = require('../../utils/util');
const CARD_COLORS = ['linear-gradient(135deg,#a8d8f8,#b0e6d0)','linear-gradient(135deg,#FFD4C8,#FFC8D6)','linear-gradient(135deg,#D4C8F0,#B8A8E0)'];
Page({
  data: {
    user: { name: '星辰大海', avatar: '星', color: '#6FD4B0', id: 'LUMI0002', bio: '探索AI的无限可能', works: 36, followers: 215, likes: 890 },
    isFollowing: false,
    works: []
  },
  onLoad(options) {
    const works = [];
    for (let i = 0; i < 6; i++) {
      works.push({ id: 400+i, imageUrl: '', title: '作品'+(i+1), prompt: '创作描述', userId: 'u2', ratio: ['3:4','4:3','1:1'][i%3], status: 'published', likes: Math.floor(Math.random()*500)+50, _userName: '星辰大海', _userAvatarText: '星', _userColor: '#6FD4B0', _cardColor: CARD_COLORS[i%3] });
    }
    this.setData({ works });
  },
  onToggleFollow() { this.setData({ isFollowing: !this.data.isFollowing }); util.showToast(this.data.isFollowing ? '已关注' : '已取消关注'); },
  onWorkTap(e) { wx.navigateTo({ url: '/pages/workDetail/index?id=' + e.detail.id }); }
});
