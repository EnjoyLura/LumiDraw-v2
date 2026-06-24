// 意见反馈页
const util = require('../../utils/util');

Page({
  data: {
    types: [
      { key: 'bug', icon: '🐛', label: 'Bug反馈' },
      { key: 'experience', icon: '😊', label: '体验反馈' },
      { key: 'suggestion', icon: '💡', label: '优化建议' }
    ],
    selectedType: 'bug',
    description: '',
    descCount: 0,
    images: [],
    wechatId: ''
  },

  onSelectType(e) {
    this.setData({ selectedType: e.currentTarget.dataset.key });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value, descCount: e.detail.value.length });
  },

  onAddImage() {
    if (this.data.images.length >= 2) return;
    util.chooseImage(1).then(paths => {
      const images = this.data.images.concat(paths);
      this.setData({ images });
    }).catch(() => {});
  },

  onRemoveImage(e) {
    const idx = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== idx);
    this.setData({ images });
  },

  onWechatInput(e) {
    this.setData({ wechatId: e.detail.value });
  },

  onSubmit() {
    util.showToast('感谢您的反馈！');
    setTimeout(() => wx.navigateBack(), 800);
  }
});
