// 编辑玩法
const util = require('../../utils/util');
Page({
  data: { name: '', sort: '', defaultPrompt: '' },
  onLoad(opt) { if (opt.id !== 'new') { this.setData({ name: '人物美颜', sort: '1', defaultPrompt: 'beautiful portrait, soft lighting, high quality' }); } },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  onSave() { if (!this.data.name) { util.showToast('请输入名称'); return; } util.showToast('已保存'); setTimeout(() => wx.navigateBack(), 500); }
});