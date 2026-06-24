// 创作页
const util = require('../../utils/util');
const config = require('../../utils/config');

// 风格颜色占位
const STYLE_COLORS = [
  '#FF6B8A', '#5B9FE8', '#333333', '#E85D75', '#D4883A',
  '#4A8CC8', '#B8A5E3', '#8B8B8B', '#6FD4B0', '#FFB59A',
  '#B8A5E3', '#CCCCCC', '#9B59B6', '#2C2C2C', '#D4883A'
];

Page({
  data: {
    // 风格颜色
    STYLE_COLORS: STYLE_COLORS,

    // 模型
    models: config.MODELS,
    selectedModelIndex: 0,
    showModelSheet: false,

    // 提示词
    prompt: '',
    promptCount: 0,
    showClearBtn: false,
    promptImage: '',
    showPromptImage: false,

    // 风格
    styles: config.STYLES,
    selectedStyle: '',
    showStyleSheet: false,

    // 精度
    qualities: config.QUALITIES,
    selectedQualityIndex: 0,

    // 比例
    ratios: config.RATIOS,
    selectedRatioIndex: 0,
    showRatioSheet: false,

    // 数量
    counts: config.COUNTS,
    selectedCountIndex: 0,

    // 积分
    costCredits: 0,

    // 生成状态: idle / generating / done
    genStatus: 'idle',
    genProgress: 0,
    genStageText: '',
    genInfo: '',
    genResults: [],
    genMeta: null
  },

  onLoad() {
    this._updateCost();
  },

  // ============ 模型选择 ============
  onOpenModelSheet() {
    this.setData({ showModelSheet: true });
  },

  onCloseModelSheet() {
    this.setData({ showModelSheet: false });
  },

  onSelectModel(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({
      selectedModelIndex: idx,
      showModelSheet: false
    });
    this._updateCost();
    util.showToast('已选择 ' + this.data.models[idx].name);
  },

  // ============ 提示词 ============
  onPromptInput(e) {
    const val = e.detail.value;
    this.setData({
      prompt: val,
      promptCount: val.length,
      showClearBtn: val.length > 0
    });
  },

  onClearPrompt() {
    this.setData({
      prompt: '',
      promptCount: 0,
      showClearBtn: false
    });
  },

  onUploadPromptImage() {
    util.chooseImage(1).then(paths => {
      this.setData({
        promptImage: paths[0],
        showPromptImage: true
      });
      util.showToast('图片已上传');
    }).catch(() => {});
  },

  onRemovePromptImage() {
    this.setData({
      promptImage: '',
      showPromptImage: false
    });
  },

  onReversePrompt() {
    wx.navigateTo({ url: '/pages/reversePrompt/index' });
  },

  // ============ 风格选择 ============
  onSelectStyle(e) {
    const style = e.currentTarget.dataset.style;
    this.setData({
      selectedStyle: style,
      showStyleSheet: false
    });
  },

  onOpenStyleSheet() {
    this.setData({ showStyleSheet: true });
  },

  onCloseStyleSheet() {
    this.setData({ showStyleSheet: false });
  },

  onConfirmStyleSheet() {
    this.setData({ showStyleSheet: false });
  },

  // ============ 精度选择 ============
  onSelectQuality(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ selectedQualityIndex: idx });
    this._updateCost();
  },

  // ============ 比例选择 ============
  onSelectRatio(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ selectedRatioIndex: idx });
  },

  onOpenRatioSheet() {
    this.setData({ showRatioSheet: true });
  },

  onCloseRatioSheet() {
    this.setData({ showRatioSheet: false });
  },

  // ============ 数量选择 ============
  onSelectCount(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ selectedCountIndex: idx });
    this._updateCost();
  },

  // ============ 积分计算 ============
  _updateCost() {
    const model = this.data.models[this.data.selectedModelIndex];
    const count = this.data.counts[this.data.selectedCountIndex];
    this.setData({ costCredits: model.cost * count });
  },

  // ============ 开始创作 ============
  onStartCreate() {
    if (!this.data.prompt.trim()) {
      util.showToast('请输入提示词');
      return;
    }
    this._startGenerate();
  },

  _startGenerate() {
    const model = this.data.models[this.data.selectedModelIndex];
    const count = this.data.counts[this.data.selectedCountIndex];
    const total = model.cost * count;
    const ratio = this.data.ratios[this.data.selectedRatioIndex].label;

    const stages = ['解析提示词...', '构建画面构图...', 'AI绘制中...', '细节优化...', '渲染输出...'];

    this.setData({
      genStatus: 'generating',
      genProgress: 0,
      genStageText: stages[0],
      genInfo: '消耗 ' + total + ' 积分 · 使用 ' + model.name + ' · 预计 15 秒',
      genResults: [],
      genMeta: null
    });

    util.showToast('创作任务已提交，正在为您生成 ' + count + ' 张图片');

    let progress = 0;
    let stageIdx = 0;

    this._genTimer = setInterval(() => {
      progress += Math.random() * 12 + 5;
      if (progress > 95) progress = 95;
      stageIdx = Math.min(Math.floor(progress / 20), stages.length - 1);
      this.setData({
        genProgress: Math.floor(progress),
        genStageText: stages[stageIdx]
      });
    }, 400);

    // 3.5秒后模拟生成完成
    setTimeout(() => {
      clearInterval(this._genTimer);
      this.setData({ genProgress: 100, genStageText: '生成完成！' });

      setTimeout(() => {
        this._showGenResults(model, count, total, ratio);
      }, 500);
    }, 3500);
  },

  _showGenResults(model, count, total, ratio) {
    const resMap = { '1:1': [1024, 1024], '3:4': [768, 1024], '4:3': [1024, 768], '16:9': [1024, 576], '9:16': [576, 1024] };
    const res = resMap[ratio] || [1024, 1024];
    const resW = res[0];
    const resH = res[1];
    const errors = ['模型服务暂时不可用', 'GPU资源不足，排队超时', '内容安全检测未通过', '生成超时，请重试', '渲染异常，请重试'];
    const resultColors = [
      'linear-gradient(135deg, #FF9A56, #FF6B8A)',
      'linear-gradient(135deg, #5B9FE8, #B8A5E3)',
      'linear-gradient(135deg, #6FD4B0, #5B9FE8)',
      'linear-gradient(135deg, #B8A5E3, #FFB59A)'
    ];

    const results = [];
    for (let i = 0; i < count; i++) {
      const failed = Math.random() < 0.15;
      results.push({
        index: i,
        failed: failed,
        error: failed ? errors[Math.floor(Math.random() * errors.length)] : '',
        color: resultColors[i % resultColors.length]
      });
    }

    const failCount = results.filter(r => r.failed).length;
    const successCount = count - failCount;
    const refund = failCount * model.cost;
    const genTime = (Math.random() * 8 + 7).toFixed(1);
    const fileSize = (Math.random() * 3 + 1.5).toFixed(1);

    let refundMsg = '';
    if (failCount > 0 && successCount > 0) {
      refundMsg = failCount + '张生成失败，已退还 ' + refund + ' 积分';
    } else if (failCount === count) {
      refundMsg = '全部失败，已退还 ' + total + ' 积分';
    }

    this.setData({
      genStatus: 'done',
      genResults: results,
      genMeta: {
        genTime: genTime,
        resW: resW,
        resH: resH,
        fileSize: fileSize,
        modelName: model.name,
        refundMsg: refundMsg,
        failCount: failCount,
        successCount: successCount,
        total: total
      }
    });

    if (failCount === 0) {
      util.showToast('生成成功！消耗' + total + '积分');
    } else if (failCount === count) {
      util.showToast('全部生成失败，' + total + '积分已退还');
    } else {
      util.showToast(successCount + '张成功，' + failCount + '张失败，退还' + refund + '积分');
    }
  },

  // 重试单张
  onRetryOne(e) {
    const idx = e.currentTarget.dataset.index;
    const results = this.data.genResults.slice();
    results[idx] = { index: idx, failed: false, error: '', color: results[idx].color, retrying: true };
    this.setData({ genResults: results });

    setTimeout(() => {
      const failed = Math.random() < 0.15;
      results[idx] = {
        index: idx,
        failed: failed,
        error: failed ? '重试失败，请稍后再试' : '',
        color: results[idx].color,
        retrying: false
      };
      this.setData({ genResults: results });
      util.showToast(failed ? '重试失败' : '重试成功！');
    }, 2000);
  },

  // 发布作品
  onPublishResult() {
    wx.navigateTo({ url: '/pages/publish/index' });
  },

  // 全部保存
  onSaveAll() {
    util.showToast('全部图片已保存到相册和草稿箱');
  },

  // ============ 查看全部模型 ============
  onViewAllModels() {
    wx.navigateTo({ url: '/pages/allModels/index' });
  }
});
