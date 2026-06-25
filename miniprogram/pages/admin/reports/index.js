// 举报队列
Page({
  data: {
    filter: 'all',
    reports: [
      { id: 1, title: '违规图片1', reporter: '星辰大海', reason: '色情低俗', time: '2小时前', status: '待处理' },
      { id: 2, title: '抄袭作品', reporter: '月光如水', reason: '侵权盗版', time: '3小时前', status: '待处理' },
      { id: 3, title: '广告推广', reporter: '风之绘师', reason: '垃圾广告', time: '5小时前', status: '待处理' },
      { id: 4, title: '不当言论', reporter: '光影魔术', reason: '煽动仇恨', time: '6小时前', status: '待处理' },
      { id: 5, title: '违规头像', reporter: '星辰大海', reason: '色情低俗', time: '8小时前', status: '已处理' },
      { id: 6, title: '虚假信息', reporter: '月光如水', reason: '虚假信息', time: '1天前', status: '已处理' },
      { id: 7, title: '违规内容', reporter: '风之绘师', reason: '违法违规', time: '1天前', status: '已驳回' },
      { id: 8, title: '盗用作品', reporter: '光影魔术', reason: '侵权盗版', time: '2天前', status: '已处理' }
    ],
    filteredReports: [],
    pendingCount: 0, processedCount: 0, rejectedCount: 0
  },
  onLoad() { this._applyFilter(); },
  onFilter(e) { this.setData({ filter: e.currentTarget.dataset.f }); this._applyFilter(); },
  _applyFilter() {
    const f = this.data.filter;
    const all = this.data.reports;
    this.setData({
      filteredReports: f === 'all' ? all : all.filter(r => r.status === f),
      pendingCount: all.filter(r => r.status === '待处理').length,
      processedCount: all.filter(r => r.status === '已处理').length,
      rejectedCount: all.filter(r => r.status === '已驳回').length
    });
  },
  onDetail(e) { wx.navigateTo({ url: '/pages/admin/reportDetail/index?id=' + e.currentTarget.dataset.id }); }
});
