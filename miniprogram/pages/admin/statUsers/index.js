// 用户统计
Page({
  data: {
    stats: [{ label: '总用户', value: '12,486' }, { label: '今日新增', value: '128' }, { label: '日活跃', value: '3,256' }],
    bars: [{ label: '6/15', h: 65 }, { label: '6/16', h: 75 }, { label: '6/17', h: 55 }, { label: '6/18', h: 95 }, { label: '6/19', h: 85 }, { label: '6/20', h: 100 }, { label: '6/21', h: 85 }],
    segments: [{ label: '普通用户', value: '9,842', pct: '78.8%', color: '#5B9FE8' }, { label: 'VIP会员', value: '2,156', pct: '17.3%', color: '#6FD4B0' }, { label: '已封禁', value: '488', pct: '3.9%', color: '#FFA8B8' }],
    metrics: [{ label: '7日留存率', value: '42.3%' }, { label: '30日留存率', value: '28.6%' }, { label: '平均使用时长', value: '18分钟' }, { label: '人均生成次数', value: '3.2次/日' }]
  }
});