// Banner管理
Page({
  data: {
    banners: [
      { id: 1, title: '夏日创作季', status: '上架中', sort: 1, date: '2026-06-01 ~ 2026-08-31' },
      { id: 2, title: '新模型上线', status: '上架中', sort: 2, date: '2026-06-15 ~ 2026-07-15' },
      { id: 3, title: '会员特惠', status: '上架中', sort: 3, date: '2026-06-10 ~ 2026-06-30' },
      { id: 4, title: '社区精选', status: '已下架', sort: 4, date: '2026-05-01 ~ 2026-05-31' }
    ]
  },
  onAdd() { wx.navigateTo({ url: '/pages/admin/bannerEdit/index?id=0' }); },
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/bannerEdit/index?id=' + e.currentTarget.dataset.id }); },
  onToggle(e) { wx.showToast({ title: '已切换状态', icon: 'none' }); }
});