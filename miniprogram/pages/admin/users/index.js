// 用户列表
Page({
  data: { users: [
    { id: 101, name: '小画家001', avatar: '画', color: '#5B9FE8', works: 23, date: '2026-03-15', status: '正常', vip: true },
    { id: 102, name: 'AI绘图迷', avatar: '绘', color: '#6FD4B0', works: 56, date: '2026-04-02', status: '正常', vip: false },
    { id: 103, name: '创意无限', avatar: '创', color: '#FFB59A', works: 12, date: '2026-01-20', status: '正常', vip: true },
    { id: 104, name: '像素大师', avatar: '像', color: '#B8A5E3', works: 38, date: '2026-05-10', status: '已封禁', vip: false }
  ]},
  onDetail(e) { wx.navigateTo({ url: '/pages/admin/userDetail/index?id=' + e.currentTarget.dataset.id }); }
});