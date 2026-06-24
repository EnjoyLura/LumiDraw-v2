// 发布作品页
const util = require('../../utils/util');

const TAGS = ['二次元','国风','风景','人像','赛博朋克','水彩','抽象','梦幻','暗黑','极简','动物','插画'];
const CARD_COLORS = ['linear-gradient(135deg,#a8d8f8,#b0e6d0)','linear-gradient(135deg,#FFD4C8,#FFC8D6)','linear-gradient(135deg,#D4C8F0,#B8A8E0)'];

Page({
  data: {
    drafts: [
      { id: 13, title: '花园机器人', color: CARD_COLORS[0], model: 'GPT Image 2', ratio: '3:4' },
      { id: 14, title: '魔法森林', color: CARD_COLORS[1], model: 'Nano Banana 2', ratio: '1:1' },
      { id: 15, title: '星空灯塔', color: CARD_COLORS[2], model: 'Seedream 4.5', ratio: '9:16' }
    ],
    selectedDraft: null,
    title: '', titleCount: 0,
    desc: '', descCount: 0,
    selectedTags: [],
    allTags: TAGS,
    showDraftPicker: false
  },

  onOpenDraftPicker() { this.setData({ showDraftPicker: true }); },
  onCloseDraftPicker() { this.setData({ showDraftPicker: false }); },
  onSelectDraft(e) {
    const id = e.currentTarget.dataset.id;
    const draft = this.data.drafts.find(d => d.id === id);
    this.setData({ selectedDraft: draft, showDraftPicker: false });
  },
  onTitleInput(e) { this.setData({ title: e.detail.value, titleCount: e.detail.value.length }); },
  onDescInput(e) { this.setData({ desc: e.detail.value, descCount: e.detail.value.length }); },
  onToggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const selected = this.data.selectedTags.slice();
    const idx = selected.indexOf(tag);
    if (idx >= 0) { selected.splice(idx, 1); }
    else if (selected.length < 5) { selected.push(tag); }
    else { util.showToast('最多选择5个标签'); return; }
    this.setData({ selectedTags: selected });
  },
  onPublish() {
    if (!this.data.selectedDraft) { util.showToast('请选择要发布的作品'); return; }
    if (!this.data.title.trim()) { util.showToast('请输入作品标题'); return; }
    util.showToast('作品发布成功！');
    setTimeout(() => wx.navigateBack(), 800);
  }
});
