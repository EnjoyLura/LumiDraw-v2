// 管理后台首页
Page({
  data: {
    stats: [
      { label: '总用户数', value: '12,486', change: '+128 今日', color: '#5B9FE8' },
      { label: '总作品数', value: '48,320', change: '+856 今日', color: '#6FD4B0' },
      { label: '今日生成', value: '1,856', change: '日均 1,420', color: '#B8A5E3' },
      { label: '今日收入', value: '¥856', change: '+12%', color: '#FFB59A' }
    ],
    contentMenus: [
      { icon: '🖼', label: 'Banner管理', page: 'banner', count: 4 },
      { icon: '🤖', label: '模型管理', page: 'model', count: 4 },
      { icon: '🎨', label: '风格管理', page: 'style', count: 15 },
      { icon: '🎮', label: '玩法管理', page: 'gameplay', count: 8 },
      { icon: '📁', label: '作品管理', page: 'works', count: 22 }
    ],
    userMenus: [
      { icon: '🚩', label: '举报队列', page: 'reports', badge: 8 },
      { icon: '👥', label: '用户列表', page: 'users', count: '12,486' }
    ],
    settingsMenus: [
      { icon: '💰', label: '积分规则', page: 'points' },
      { icon: '🛡', label: '审核设置', page: 'audit' }
    ]
  },
  onNav(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({ url: '/pages/admin/' + page + '/index' });
  },
  onStatNav(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({ url: '/pages/admin/' + page + '/index' });
  }
});
