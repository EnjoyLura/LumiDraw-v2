// 反推提示词页
const util = require('../../utils/util');
Page({
  data: { imageUploaded: false, imageUrl: '', analyzing: false, analyzed: false, resultText: '' },
  onUploadImage() {
    util.chooseImage(1).then(paths => {
      this.setData({ imageUploaded: true, imageUrl: paths[0], analyzed: false });
    }).catch(() => {});
  },
  onAnalyze() {
    this.setData({ analyzing: true });
    setTimeout(() => {
      this.setData({ analyzing: false, analyzed: true, resultText: 'A beautiful scene with soft lighting, dreamy atmosphere, pastel color palette, detailed composition, artistic style, high quality' });
      util.showToast('分析完成！消耗5积分');
    }, 2000);
  },
  onCopyResult() { util.copyText(this.data.resultText); },
  onUseResult() {
    wx.switchTab({ url: '/pages/create/index' });
    util.showToast('已带入创作页');
  }
});
