// 设置页
const util = require('../../utils/util');

Page({
  data: {
    darkMode: false,
    cacheSize: '12.5MB',
    version: 'v1.0.0'
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/editProfile/index' });
  },

  onBindPhone() {
    util.showToast('手机号已绑定');
  },

  onToggleDark() {
    this.setData({ darkMode: !this.data.darkMode });
  },

  onAgreement() {
    util.showToast('用户协议');
  },

  onPrivacy() {
    util.showToast('隐私政策');
  },

  onRechargeAgreement() {
    util.showToast('充值协议');
  },

  onClearCache() {
    util.showToast('缓存已清除');
  },

  onVersion() {
    // 隐藏入口：连续点击5次进入管理后台
    if (!this._versionTaps) this._versionTaps = 0;
    this._versionTaps++;
    if (this._versionTaps >= 5) {
      this._versionTaps = 0;
      wx.navigateTo({ url: '/pages/admin/index/index' });
    }
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmColor: '#FF6B8A',
      success: function(res) {
        if (res.confirm) {
          util.showToast('已退出登录');
        }
      }
    });
  }
});
