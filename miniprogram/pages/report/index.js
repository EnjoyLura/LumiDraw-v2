// 举报页
const util = require('../../utils/util');
const REASONS = ['垃圾广告','色情低俗','违法违规','侵权盗版','煽动仇恨','虚假信息','其他原因'];
Page({
  data: { reasons: REASONS, selectedReason: -1, desc: '' },
  onSelectReason(e) { this.setData({ selectedReason: parseInt(e.currentTarget.dataset.index) }); },
  onDescInput(e) { this.setData({ desc: e.detail.value }); },
  onSubmit() {
    if (this.data.selectedReason < 0) { util.showToast('请选择举报原因'); return; }
    util.showToast('举报已提交，我们会尽快处理');
    setTimeout(() => wx.navigateBack(), 800);
  }
});
