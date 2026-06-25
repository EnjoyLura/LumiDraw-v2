Component({
  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: false },
    transparent: { type: Boolean, value: false }
  },
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    totalHeight: 64
  },
  lifetimes: {
    attached() {
      const sys = wx.getSystemInfoSync();
      const sbh = sys.statusBarHeight || 20;
      this.setData({
        statusBarHeight: sbh,
        navBarHeight: 44,
        totalHeight: sbh + 44
      });
    }
  },
  methods: {
    onBack() {
      wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/home/index' }) });
    }
  }
});
