Component({
  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: false },
    transparent: { type: Boolean, value: false }
  },
  data: {
    statusBarHeight: 20,
    navBarHeight: 44
  },
  lifetimes: {
    attached() {
      const sys = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: sys.statusBarHeight || 20,
        navBarHeight: 44
      });
    }
  },
  methods: {
    onBack() {
      wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/home/index' }) });
    }
  }
});
