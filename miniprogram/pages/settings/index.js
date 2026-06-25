// 设置页
const util = require('../../utils/util');

Page({
  data: {
    darkMode: false,
    cacheSize: '12.5MB',
    version: 'v1.0.0'
  },

  onLoad() {
    const app = getApp();
    this.setData({ darkMode: app.globalData.theme === 'dark' });
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/editProfile/index' });
  },

  onBindPhone() {
    util.showToast('手机号已绑定');
  },

  onToggleDark(e) {
    const isDark = e.detail.value;
    this.setData({ darkMode: isDark });
    const app = getApp();
    app.globalData.theme = isDark ? 'dark' : 'light';
    wx.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#0A1428' : '#FFFFFF',
      animation: { duration: 300, timingFunc: 'easeIn' }
    });
    wx.setBackgroundColor({
      backgroundColor: isDark ? '#0A1428' : '#EEF4FC'
    });
    util.showToast(isDark ? '已切换为深色模式' : '已切换为浅色模式');
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
    this.setData({ cacheSize: '0MB' });
  },

  onVersion() {
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
