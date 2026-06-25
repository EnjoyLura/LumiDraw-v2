// 发布作品页
const util = require('../../utils/util');

const RESOLUTION_MAP = {
  '1:1': '1024×1024', '3:4': '768×1024', '4:3': '1024×768',
  '16:9': '1024×576', '9:16': '576×1024', '2:3': '683×1024', '3:2': '1024×683'
};

const TAG_STYLES = [
  { name: '二次元', bg: 'rgba(255,179,193,0.15)', color: '#E85D75' },
  { name: '国风', bg: 'rgba(163,228,204,0.15)', color: '#3BA57A' },
  { name: '风景', bg: 'rgba(168,216,240,0.15)', color: '#4A9DC8' },
  { name: '人像', bg: 'rgba(255,212,168,0.15)', color: '#D4883A' },
  { name: '赛博朋克', bg: 'rgba(184,165,227,0.15)', color: '#7B5FB5' },
  { name: '水彩', bg: 'rgba(145,200,240,0.15)', color: '#4A8CC8' },
  { name: '抽象', bg: 'rgba(255,210,76,0.15)', color: '#C89520' },
  { name: '梦幻', bg: 'rgba(200,181,232,0.15)', color: '#8B6DB8' },
  { name: '暗黑', bg: 'rgba(100,100,120,0.15)', color: '#555568' },
  { name: '极简', bg: 'rgba(91,159,232,0.15)', color: '#4A8CCE' },
  { name: '动物', bg: 'rgba(111,212,176,0.15)', color: '#3BA57A' },
  { name: '插画', bg: 'rgba(240,140,160,0.15)', color: '#D4556A' }
];

const CARD_COLORS = [
  'linear-gradient(135deg,#a8d8f8,#b0e6d0)',
  'linear-gradient(135deg,#FFD4C8,#FFC8D6)',
  'linear-gradient(135deg,#D4C8F0,#B8A8E0)'
];

Page({
  data: {
    drafts: [
      { id: 13, title: '花园机器人', color: CARD_COLORS[0], model: 'GPT Image 2', ratio: '3:4', style: '二次元', resolution: '768×1024' },
      { id: 14, title: '魔法森林', color: CARD_COLORS[1], model: 'Nano Banana 2', ratio: '1:1', style: '梦幻', resolution: '1024×1024' },
      { id: 15, title: '星空灯塔', color: CARD_COLORS[2], model: 'Seedream 4.5', ratio: '9:16', style: '风景', resolution: '576×1024' }
    ],
    selectedDraft: null,
    title: '', titleCount: 0,
    desc: '', descCount: 0,
    titleFocused: false,
    descFocused: false,
    selectedTags: [],
    tagItems: [],
    showDraftPicker: false,
    showImgPreview: false,
    previewImgSrc: ''
  },

  onLoad() {
    this._updateTagItems();
  },

  _updateTagItems() {
    const selected = this.data.selectedTags;
    const items = TAG_STYLES.map(t => ({
      name: t.name, bg: t.bg, color: t.color,
      selected: selected.indexOf(t.name) >= 0
    }));
    this.setData({ tagItems: items });
  },

  onOpenDraftPicker() { this.setData({ showDraftPicker: true }); },
  onCloseDraftPicker() { this.setData({ showDraftPicker: false }); },

  onSelectDraft(e) {
    const id = e.currentTarget.dataset.id;
    const draft = this.data.drafts.find(d => d.id === id);
    if (draft) {
      draft.resolution = RESOLUTION_MAP[draft.ratio] || '1024×1024';
    }
    this.setData({ selectedDraft: draft, showDraftPicker: false });
    if (draft && !this.data.title) {
      this.setData({ title: draft.title, titleCount: draft.title.length });
    }
  },

  onPreviewDraft() {
    if (this.data.selectedDraft) {
      this.setData({ showImgPreview: true, previewImgSrc: '' });
    }
  },

  onPreviewDraftImage(e) {
    this.setData({ showImgPreview: true, previewImgSrc: '' });
  },

  onCloseImgPreview() {
    this.setData({ showImgPreview: false });
  },

  onTitleInput(e) { this.setData({ title: e.detail.value, titleCount: e.detail.value.length }); },
  onTitleFocus() { this.setData({ titleFocused: true }); },
  onTitleBlur() { this.setData({ titleFocused: false }); },

  onDescInput(e) { this.setData({ desc: e.detail.value, descCount: e.detail.value.length }); },
  onDescFocus() { this.setData({ descFocused: true }); },
  onDescBlur() { this.setData({ descFocused: false }); },

  onToggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const selected = this.data.selectedTags.slice();
    const idx = selected.indexOf(tag);
    if (idx >= 0) { selected.splice(idx, 1); }
    else if (selected.length < 5) { selected.push(tag); }
    else { util.showToast('最多选择5个标签'); return; }
    this.setData({ selectedTags: selected });
    this._updateTagItems();
  },

  onPublish() {
    if (!this.data.selectedDraft) { util.showToast('请选择要发布的作品'); return; }
    if (!this.data.title.trim()) { util.showToast('请输入作品标题'); return; }
    util.showToast('作品发布成功！');
    setTimeout(() => wx.navigateBack(), 800);
  }
});
