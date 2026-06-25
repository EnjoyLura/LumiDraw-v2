// Banner管理
const util = require('../../../utils/util');
Page({
  data: {
    banners: [
      { id: 1, title: '夏日创作季', status: '上架中', sort: 1, link: 'create', date: '06-01 ~ 08-31', gradient: 'linear-gradient(135deg, #FF9A56, #FF6B8A)' },
      { id: 2, title: '新模型上线', status: '上架中', sort: 2, link: 'allModels', date: '06-15 ~ 07-15', gradient: 'linear-gradient(135deg, #5B9FE8, #B8A5E3)' },
      { id: 3, title: '会员特惠', status: '上架中', sort: 3, link: 'membership', date: '06-10 ~ 06-30', gradient: 'linear-gradient(135deg, #B8A5E3, #FFD700)' },
      { id: 4, title: '社区精选', status: '已下架', sort: 4, link: 'plaza', date: '05-01 ~ 05-31', gradient: 'linear-gradient(135deg, #6FD4B0, #5B9FE8)' }
    ]
  },
  onAdd() { wx.navigateTo({ url: '/pages/admin/bannerEdit/index?id=0' }); },
  onEdit(e) { wx.navigateTo({ url: '/pages/admin/bannerEdit/index?id=' + e.currentTarget.dataset.id }); },
  onToggle(e) {
    const id = e.currentTarget.dataset.id;
    const banners = this.data.banners.map(b => {
      if (b.id === id) return Object.assign({}, b, { status: b.status === '上架中' ? '已下架' : '上架中' });
      return b;
    });
    this.setData({ banners });
    util.showToast('状态已切换');
  },
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除', content: '确定删除此Banner？', confirmColor: '#FF6B8A',
      success: (res) => {
        if (res.confirm) {
          this.setData({ banners: this.data.banners.filter(b => b.id !== id) });
          util.showToast('已删除');
        }
      }
    });
  }
});
