// 举报详情
const util = require('../../utils/util');
Page({
  data: { report: { title: '违规图片1', reporter: '星辰大海', reason: '色情低俗', time: '2小时前', status: '待处理' } },
  onDeleteBan() { util.showToast('已删除作品并封禁用户'); setTimeout(() => wx.navigateBack(), 500); },
  onDeleteOnly() { util.showToast('已删除作品'); setTimeout(() => wx.navigateBack(), 500); },
  onDismiss() { util.showToast('已驳回举报'); setTimeout(() => wx.navigateBack(), 500); }
});