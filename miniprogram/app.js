// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }

    // 初始化云开发
    wx.cloud.init({
      env: 'cloud1-d9g2e4d5cedc3365',
      traceUser: true
    });

    this.globalData = {
      env: 'cloud1-d9g2e4d5cedc3365',
      userInfo: null,
      theme: 'light',
      // 生成中的任务列表（创作页和画廊页共享）
      generatingTasks: []
    };

    // 自动登录
    this._login();
  },

  // 登录流程
  _login() {
    const api = require('./utils/api');
    api.call('user.login').then(data => {
      this.globalData.userInfo = data;
      console.log('登录成功', data);
    }).catch(err => {
      console.warn('云函数登录失败，使用本地Mock用户', err.message || err);
      // 开发阶段：提供Mock用户，避免阻塞页面渲染
      this.globalData.userInfo = {
        _id: 'mock_user',
        openid: 'mock_openid',
        userId: 'LUMI8829',
        nickName: '云端造梦师',
        avatarText: '梦',
        avatarColor: '#5B9FE8',
        gender: 'male',
        signature: '用AI描绘心中的梦境，每一笔都是想象力的延伸',
        credits: 2860,
        vipStatus: false,
        isAdmin: true
      };
    });
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo;
  }
});
