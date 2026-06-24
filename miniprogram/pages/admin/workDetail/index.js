// 作品详情管理
const util = require('../../utils/util');
Page({
  data: { work: { title: '霓虹都市', user: '星辰大海', model: 'GPT Image 2', style: '赛博朋克', ratio: '3:4', time: '2小时前', status: '已发布', likes: 328, favorites: 92, remakes: 45, prompt: 'cyberpunk city at night, neon lights' } },
  onUnpublish() { util.showToast('已下架'); },
  onRecommend() { util.showToast('已设为推荐'); },
  onDelete() { wx.showModal({ title: '确认', content: '删除后不可恢复', success(r) { if (r.confirm) { util.showToast('已删除'); setTimeout(() => wx.navigateBack(), 500); } } }); }
});