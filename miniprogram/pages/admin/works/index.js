// 作品管理
const COLORS = ['linear-gradient(135deg,#a8d8f8,#b0e6d0)','linear-gradient(135deg,#FFD4C8,#FFC8D6)','linear-gradient(135deg,#D4C8F0,#B8A8E0)','linear-gradient(135deg,#A3E4CC,#8BD8B8)'];
Page({
  data: { filter: 'all', works: [
    { id: 1, title: '霓虹都市', user: '星辰大海', time: '2小时前', status: '已发布', likes: 328, color: COLORS[0] },
    { id: 2, title: '山水之间', user: '月光如水', time: '3小时前', status: '已发布', likes: 512, color: COLORS[1] },
    { id: 3, title: '少女与猫', user: '云端造梦师', time: '5小时前', status: '已发布', likes: 680, color: COLORS[2] },
    { id: 5, title: '古风少女', user: '云端造梦师', time: '8小时前', status: '未发布', likes: 0, color: COLORS[3] }
  ], filteredWorks: [] },
  onLoad() { this._applyFilter(); },
  onFilter(e) { this.setData({ filter: e.currentTarget.dataset.f }); this._applyFilter(); },
  _applyFilter() {
    const f = this.data.filter;
    const list = f === 'all' ? this.data.works : this.data.works.filter(w => w.status === f);
    this.setData({ filteredWorks: list });
  },
  onDetail(e) { wx.navigateTo({ url: '/pages/admin/workDetail/index?id=' + e.currentTarget.dataset.id }); }
});
