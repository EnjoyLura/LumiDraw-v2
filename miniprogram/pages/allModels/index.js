// 全部模型页
const config = require('../../utils/config');
const util = require('../../utils/util');
Page({
  data: { models: config.MODELS, selectedIndex: 0 },
  onLoad() {},
  onSelect(e) {
    const idx = parseInt(e.currentTarget.dataset.index);
    this.setData({ selectedIndex: idx });
    util.showToast('已选择 ' + this.data.models[idx].name);
    setTimeout(() => wx.navigateBack(), 500);
  }
});
