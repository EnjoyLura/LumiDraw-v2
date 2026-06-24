// 编辑模型
const util = require('../../utils/util');
Page({
  data: { name: '', desc: '', cost: '', tags: '', badge: '' },
  onLoad(opt) { if (opt.id !== 'new') { this.setData({ name: 'Nano Banana 2', desc: '速度极快·性价比高', cost: '8', tags: '快速,全能', badge: '性价比' }); } },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  onSave() { if (!this.data.name) { util.showToast('请输入名称'); return; } util.showToast('已保存'); setTimeout(() => wx.navigateBack(), 500); }
});