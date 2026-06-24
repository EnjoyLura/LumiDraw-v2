// 作品管理
Page({
  data: { filter: 'all', works: [
    { id: 1, title: '霓虹都市', user: '星辰大海', time: '2小时前', status: '已发布', likes: 328 },
    { id: 2, title: '山水之间', user: '月光如水', time: '3小时前', status: '已发布', likes: 512 },
    { id: 3, title: '少女与猫', user: '云端造梦师', time: '5小时前', status: '已发布', likes: 680 },
    { id: 5, title: '古风少女', user: '云端造梦师', time: '8小时前', status: '未发布', likes: 0 }
  ]},
  onFilter(e) { this.setData({ filter: e.currentTarget.dataset.f }); },
  onDetail(e) { wx.navigateTo({ url: '/pages/admin/workDetail/index?id=' + e.currentTarget.dataset.id }); }
});