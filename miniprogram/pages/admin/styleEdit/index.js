// 编辑风格
const util = require('../../utils/util');
Page({
  data: { name: '', desc: '', sort: '', promptSuffix: '' },
  onLoad(opt) { if (opt.id !== 'new') { this.setData({ name: '赛博朋克', desc: '霓虹灯光与未来科技', sort: '1', promptSuffix: 'cyberpunk style, neon lights' }); } },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  onSave() { if (!this.data.name) { util.showToast('请输入名称'); return; } util.showToast('已保存'); setTimeout(() => wx.navigateBack(), 500); }
});