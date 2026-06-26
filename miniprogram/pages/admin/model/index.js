// 模型管理
const util = require('../../../utils/util');
Page({
  data: { models: [
    { name: 'Nano Banana 2', desc: '速度极快·性价比高', cost: 8, badge: '性价比', badgeColor: '#6FD4B0', tags: ['快速', '全能'], color: 'linear-gradient(135deg, #6FD4B0, #5B9FE8)', enabled: true },
    { name: 'GPT Image 2', desc: '画质细腻·理解力强', cost: 15, badge: '推荐', badgeColor: '#5B9FE8', tags: ['写实', '高清'], color: 'linear-gradient(135deg, #5B9FE8, #B8A5E3)', enabled: true },
    { name: 'Nano Banana Pro', desc: '进阶版本·质量更高', cost: 12, badge: 'NEW', badgeColor: '#FFA8B8', tags: ['高质量', '进阶'], color: 'linear-gradient(135deg, #FFA8B8, #FFB59A)', enabled: true },
    { name: 'Seedream 4.5', desc: '高保真·4K支持', cost: 10, badge: '', tags: ['高保真', '4K'], color: 'linear-gradient(135deg, #B8A5E3, #5B9FE8)', enabled: true }
  ]},
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/modelEdit/index?id=' + e.currentTarget.dataset.idx }); },
  onAdd() { wx.navigateTo({ url: '/pages/admin/modelEdit/index?id=new' }); },
  onToggle(e) {
    const idx = e.currentTarget.dataset.idx;
    const models = this.data.models.slice();
    models[idx] = Object.assign({}, models[idx], { enabled: e.detail.value });
    this.setData({ models });
    util.showToast(e.detail.value ? '已启用' : '已禁用');
  }
});
