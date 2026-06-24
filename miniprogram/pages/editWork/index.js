// 编辑作品页
const util = require('../../utils/util');
const TAGS = ['二次元','国风','风景','人像','赛博朋克','水彩','抽象','梦幻','暗黑','极简','动物','插画'];

Page({
  data: {
    work: { model: 'GPT Image 2', ratio: '3:4', color: 'linear-gradient(135deg,#5B9FE8,#B8A5E3)' },
    title: '', titleCount: 0, desc: '', descCount: 0,
    selectedTags: [], allTags: TAGS
  },
  onLoad(options) {
    this.setData({ title: '霓虹都市', titleCount: 4, desc: '赛博朋克风格的夜晚城市', descCount: 11, selectedTags: ['二次元','赛博朋克'] });
  },
  onTitleInput(e) { this.setData({ title: e.detail.value, titleCount: e.detail.value.length }); },
  onDescInput(e) { this.setData({ desc: e.detail.value, descCount: e.detail.value.length }); },
  onToggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const sel = this.data.selectedTags.slice();
    const idx = sel.indexOf(tag);
    if (idx >= 0) sel.splice(idx, 1);
    else if (sel.length < 5) sel.push(tag);
    else { util.showToast('最多选择5个标签'); return; }
    this.setData({ selectedTags: sel });
  },
  onSave() {
    if (!this.data.title.trim()) { util.showToast('请输入作品标题'); return; }
    util.showToast('作品信息已保存');
    setTimeout(() => wx.navigateBack(), 800);
  }
});
