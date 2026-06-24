// 生成统计
Page({
  data: {
    stats: [{ label: '今日生成', value: '1,856' }, { label: '日均生成', value: '1,420' }, { label: '成功率', value: '96.8%' }],
    bars: [{ label: '6/15', h: 75 }, { label: '6/16', h: 85 }, { label: '6/17', h: 65 }, { label: '6/18', h: 95 }, { label: '6/19', h: 88 }, { label: '6/20', h: 98 }, { label: '6/21', h: 100 }],
    models: [{ name: 'GPT Image 2', count: '620次', pct: 33.4, color: '#5B9FE8' }, { name: 'Seedream 4.5', count: '412次', pct: 22.2, color: '#B8A5E3' }, { name: 'Nano Banana Pro', count: '318次', pct: 17.1, color: '#FFA8B8' }, { name: 'Nano Banana 2', count: '256次', pct: 13.8, color: '#6FD4B0' }],
    metrics: [{ label: '平均生成耗时', value: '8.2秒' }, { label: '队列等待时间', value: '2.1秒' }, { label: '失败率', value: '3.2%' }, { label: 'GPU利用率', value: '78.5%' }]
  }
});