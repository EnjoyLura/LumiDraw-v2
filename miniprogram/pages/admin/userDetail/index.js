// 用户详情
const util = require('../../utils/util');
Page({
  data: { user: { name: '小画家001', avatar: '画', color: '#5B9FE8', id: 101, date: '2026-03-15', works: 23, vip: true, status: '正常' } },
  onViewWorks() { wx.navigateTo({ url: '/pages/admin/userWorks/index?id=' + this.data.user.id }); },
  onBan() { util.showToast('已封禁'); },
  onUnban() { util.showToast('已解封'); }
});