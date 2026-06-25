// 我的页
const util = require('../../utils/util');

Page({
  data: {
    user: {
      nickName: '云端造梦师',
      userId: 'LUMI8829',
      avatarText: '梦',
      avatarColor: '#5B9FE8',
      credits: 2860
    },
    unreadCount: 5,
    menuList: [
      { icon: '✉', label: '消息中心', color: '#FFA8B8', page: 'messages', badge: 5 },
      { icon: '⚙', label: '设置', color: '#5B9FE8', page: 'settings' },
      { icon: '◷', label: '浏览记录', color: '#6FD4B0', page: 'history' },
      { icon: '♡', label: '我的关注', color: '#FFB59A', page: 'followList' }
    ],
    serviceList: [
      { icon: '📝', label: '意见反馈', color: '#8497B5', page: 'feedback' },
      { icon: '📞', label: '联系客服', color: '#8497B5', action: 'customerService' }
    ]
  },

  onLoad() {},

  onShow() {
    this.setData({ tabEnterClass: 'tab-page-enter' });
    setTimeout(() => this.setData({ tabEnterClass: '' }), 350);
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/editProfile/index' });
  },

  // ============ 导航 ============
  onRecharge() {
    wx.navigateTo({ url: '/pages/recharge/index' });
  },

  onQuickNav(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({ url: '/pages/' + page + '/index' });
  },

  onMenuTap(e) {
    const item = e.currentTarget.dataset.item;
    if (item.page === 'followList') {
      wx.navigateTo({ url: '/pages/followList/index?type=following' });
    } else if (item.page) {
      wx.navigateTo({ url: '/pages/' + item.page + '/index' });
    }
  },

  onServiceTap(e) {
    const item = e.currentTarget.dataset.item;
    if (item.action === 'customerService') {
      util.showToast('打开微信客服');
    } else if (item.page) {
      wx.navigateTo({ url: '/pages/' + item.page + '/index' });
    }
  }
});
