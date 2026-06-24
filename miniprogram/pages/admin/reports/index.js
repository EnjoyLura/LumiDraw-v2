// 举报队列
Page({
  data: { filter: 'all', reports: [
    { id: 1, title: '违规图片1', reporter: '星辰大海', reason: '色情低俗', time: '2小时前', status: '待处理' },
    { id: 2, title: '抄袭作品', reporter: '月光如水', reason: '侵权盗版', time: '3小时前', status: '待处理' },
    { id: 3, title: '广告推广', reporter: '风之绘师', reason: '垃圾广告', time: '5小时前', status: '待处理' },
    { id: 5, title: '违规头像', reporter: '星辰大海', reason: '色情低俗', time: '8小时前', status: '已处理' }
  ]},
  onFilter(e) { this.setData({ filter: e.currentTarget.dataset.f }); },
  onDetail(e) { wx.navigateTo({ url: '/pages/admin/reportDetail/index?id=' + e.currentTarget.dataset.id }); }
});