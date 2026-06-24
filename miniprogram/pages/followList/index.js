// 关注/粉丝列表
const util = require('../../utils/util');
Page({
  data: { type: 'following', title: '我的关注', users: [] },
  onLoad(options) {
    const type = options.type || 'following';
    const title = type === 'following' ? '我的关注' : '我的粉丝';
    wx.setNavigationBarTitle({ title });
    this.setData({ type, title, users: [
      { id: 'u2', name: '星辰大海', avatar: '星', color: '#6FD4B0', bio: '探索AI的无限可能', isFollowing: true },
      { id: 'u3', name: '月光如水', avatar: '月', color: '#FFB59A', bio: '月光下的AI画家', isFollowing: true },
      { id: 'u4', name: '风之绘师', avatar: '风', color: '#B8A5E3', bio: '风中捕捉灵感', isFollowing: false }
    ]});
  },
  onToggleFollow(e) {
    const idx = e.currentTarget.dataset.index;
    const users = this.data.users.slice();
    users[idx].isFollowing = !users[idx].isFollowing;
    this.setData({ users });
    util.showToast(users[idx].isFollowing ? '已关注' : '已取消关注');
  },
  onUserTap(e) { wx.navigateTo({ url: '/pages/userProfile/index?userId=' + e.currentTarget.dataset.id }); }
});
