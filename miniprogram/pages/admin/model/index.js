// 模型管理
Page({
  data: { models: [
    { name: 'Nano Banana 2', desc: '速度极快·性价比高', cost: 8, badge: '性价比', enabled: true },
    { name: 'GPT Image 2', desc: '画质细腻·理解力强', cost: 15, badge: '推荐', enabled: true },
    { name: 'Nano Banana Pro', desc: '进阶版本·质量更高', cost: 12, badge: 'NEW', enabled: true },
    { name: 'Seedream 4.5', desc: '高保真·4K支持', cost: 10, badge: '', enabled: true }
  ]},
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/modelEdit/index?id=' + e.currentTarget.dataset.idx }); },
  onAdd() { wx.navigateTo({ url: '/pages/admin/modelEdit/index?id=new' }); },
  onToggle(e) { wx.showToast({ title: '已切换', icon: 'none' }); }
});