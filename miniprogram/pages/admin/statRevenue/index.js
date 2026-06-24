// 收入统计
Page({
  data: {
    stats: [{ label: '今日收入', value: '¥856' }, { label: '本月累计', value: '¥18,650' }, { label: 'ARPU', value: '¥1.49' }],
    bars: [{ label: '6/15', h: 72 }, { label: '6/16', h: 78 }, { label: '6/17', h: 58 }, { label: '6/18', h: 95 }, { label: '6/19', h: 82 }, { label: '6/20', h: 100 }, { label: '6/21', h: 90 }],
    tiers: [{ name: '¥6 (60积分)', orders: '1,280笔' }, { name: '¥18 (180积分)', orders: '860笔' }, { name: '¥30 (300积分)', orders: '620笔' }, { name: '¥68 (680积分)', orders: '780笔' }, { name: '¥128 (1280积分)', orders: '380笔' }],
    metrics: [{ label: '付费率', value: '6.8%' }, { label: '复购率', value: '42.3%' }, { label: '平均客单价', value: '¥38.6' }, { label: '退款率', value: '0.8%' }]
  }
});