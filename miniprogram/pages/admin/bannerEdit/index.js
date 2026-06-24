// 编辑Banner
const util = require('../../utils/util');
Page({
  data: { title: '', link: '', sort: '', startDate: '', endDate: '' },
  onLoad(opt) { if (opt.id !== '0') { this.setData({ title: '夏日创作季', link: 'create', sort: '1', startDate: '2026-06-01', endDate: '2026-08-31' }); } },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  onSave() { if (!this.data.title) { util.showToast('请输入标题'); return; } util.showToast('已保存'); setTimeout(() => wx.navigateBack(), 500); }
});