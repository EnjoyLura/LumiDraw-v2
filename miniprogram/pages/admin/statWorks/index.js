// 作品统计
Page({
  data: {
    stats: [{ label: '总作品', value: '48,320' }, { label: '已发布', value: '36,240' }, { label: '未发布', value: '12,080' }],
    bars: [{ label: '6/15', h: 72 }, { label: '6/16', h: 78 }, { label: '6/17', h: 62 }, { label: '6/18', h: 88 }, { label: '6/19', h: 92 }, { label: '6/20', h: 100 }, { label: '6/21', h: 92 }],
    styles: [{ name: '二次元', count: '12,860', pct: 26.6 }, { name: '国风', count: '8,240', pct: 17.1 }, { name: '写实', count: '7,680', pct: 15.9 }, { name: '赛博朋克', count: '5,420', pct: 11.2 }, { name: '水彩', count: '4,310', pct: 8.9 }],
    metrics: [{ label: '总点赞数', value: '286,450' }, { label: '总收藏数', value: '98,320' }, { label: '总同款生成', value: '45,680' }, { label: '平均点赞/作品', value: '5.9' }]
  }
});