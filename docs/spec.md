# Lumi-Draw 开发规格说明（Spec）

> **版本**：v1.0.0  
> **日期**：2026-06-21  
> **对应技术文档**：v1.0.0  
> **用途**：指导 vibe coding 实际编码

---

## 一、项目初始化配置

### 1.1 project.config.json

更新项：
- `projectname`: "lumi-draw"
- `libVersion`: 升级到 "3.4.0"（支持最新API）
- `condition.miniprogram.list`: 添加各页面调试入口

### 1.2 app.json

```json
{
  "pages": [
    "pages/home/index",
    "pages/plaza/index",
    "pages/create/index",
    "pages/gallery/index",
    "pages/mine/index"
  ],
  "subpackages": [
    {
      "root": "pages/subpkg-community",
      "pages": ["search/index","workDetail/index","publish/index","followList/index","editWork/index","report/index","userProfile/index"]
    },
    {
      "root": "pages/subpkg-profile",
      "pages": ["editProfile/index","recharge/index","checkin/index","invite/index","membership/index","messages/index","settings/index","history/index","feedback/index","msgDetail/index"]
    },
    {
      "root": "pages/subpkg-create",
      "pages": ["reversePrompt/index","allModels/index","allGameplays/index"]
    },
    {
      "root": "pages/subpkg-admin",
      "pages": ["admin/index","admin/banner","admin/model","admin/style","admin/gameplay","admin/works","admin/reports","admin/users","admin/points","admin/audit"]
    }
  ],
  "tabBar": {
    "custom": true,
    "color": "#8497B5",
    "selectedColor": "#5B9FE8",
    "backgroundColor": "#FFFFFF",
    "list": [
      { "pagePath": "pages/home/index", "text": "首页", "iconPath": "images/tab/home.png", "selectedIconPath": "images/tab/home-active.png" },
      { "pagePath": "pages/plaza/index", "text": "广场", "iconPath": "images/tab/plaza.png", "selectedIconPath": "images/tab/plaza-active.png" },
      { "pagePath": "pages/create/index", "text": "创作", "iconPath": "images/tab/create.png", "selectedIconPath": "images/tab/create-active.png" },
      { "pagePath": "pages/gallery/index", "text": "画廊", "iconPath": "images/tab/gallery.png", "selectedIconPath": "images/tab/gallery-active.png" },
      { "pagePath": "pages/mine/index", "text": "我的", "iconPath": "images/tab/mine.png", "selectedIconPath": "images/tab/mine-active.png" }
    ]
  },
  "window": {
    "navigationBarBackgroundColor": "#EEF4FC",
    "navigationBarTitleText": "绘光",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#EEF4FC",
    "backgroundTextStyle": "dark"
  },
  "lazyCodeLoading": "requiredComponents",
  "sitemapLocation": "sitemap.json"
}
```

**注意**：自定义tabBar时创作Tab的凸起渐变按钮需要在 `custom-tab-bar` 组件中实现，系统的tabBar图标仅做占位。

### 1.3 app.js

```javascript
App({
  globalData: {
    env: '',           // 云环境ID，部署时填入
    openid: '',
    userInfo: null,
    theme: 'light',
    systemInfo: null,
    statusBarHeight: 0,
    customBarHeight: 0,
    isAdmin: false,
    models: [],        // 缓存
    styles: [],        // 缓存
  },

  onLaunch() {
    // 1. 初始化云开发
    wx.cloud.init({ env: this.globalData.env, traceUser: true });
    
    // 2. 获取系统信息
    const sysInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = sysInfo;
    this.globalData.statusBarHeight = sysInfo.statusBarHeight;
    this.globalData.customBarHeight = sysInfo.statusBarHeight + 44;
    
    // 3. 加载主题
    const savedTheme = wx.getStorageSync('theme') || 'light';
    this.globalData.theme = savedTheme;
    
    // 4. 静默登录
    this.silentLogin();
  },

  async silentLogin() {
    try {
      const res = await wx.cloud.callFunction({ name: 'user', data: { action: 'login' } });
      if (res.result.code === 0) {
        this.globalData.openid = res.result.data.openid;
        this.globalData.userInfo = res.result.data.userInfo;
        this.globalData.isAdmin = res.result.data.userInfo.isAdmin;
      }
    } catch (e) {
      console.error('登录失败', e);
    }
  },

  switchTheme(theme) {
    this.globalData.theme = theme;
    wx.setStorageSync('theme', theme);
    // 通过EventBus通知所有页面
    this.eventBus && this.eventBus.emit('THEME_CHANGED', theme);
  }
});
```

### 1.4 目录结构

```
miniprogram/
├── config/
│   ├── constants.js    # 错误码、枚举、配置常量
│   └── defaults.js     # 模型/风格/Banner默认数据（离线fallback）
├── utils/
│   ├── cloud.js        # callCloud(name, action, data) 统一封装
│   ├── image.js        # uploadToCloud, saveToAlbum, previewImage
│   ├── format.js       # formatNumber, formatDate, timeAgo
│   ├── storage.js      # get/set/remove + 搜索历史管理
│   ├── auth.js         # checkPhoneBound, requirePhoneBind
│   ├── eventBus.js     # on/off/emit 事件总线
│   └── validator.js    # validateRequired, validateMaxLength
├── styles/
│   ├── tokens.wxss     # 全部CSS变量（light+dark）
│   ├── base.wxss       # 全局重置、布局工具类、文字排版
│   └── animations.wxss # @keyframes定义
├── components/         # 16个公共组件（详见第三章）
├── images/
│   ├── tab/            # 10个Tab图标（normal+active各5个）
│   ├── icons/          # 通用图标SVG/PNG
│   └── placeholder/    # 骨架屏占位图
└── pages/              # 所有页面
```

---

## 二、设计令牌与样式系统

### 2.1 tokens.wxss（完整变量定义）

```css
/* 浅色主题 */
page[data-theme="light"] {
  --bg-base: #EEF4FC;
  --bg-soft: #E1EBF8;
  --bg-card: #FFFFFF;
  --bg-elevated: #FBFDFF;
  --bg-glass: rgba(255,255,255,0.72);
  --fg-primary: #0E1F3A;
  --fg-secondary: #445876;
  --fg-muted: #8497B5;
  --border: rgba(91,159,232,0.14);
  --border-strong: rgba(91,159,232,0.32);
  --accent: #5B9FE8;
  --accent-deep: #3B7FC8;
  --accent-soft: rgba(91,159,232,0.12);
  --accent-glow: rgba(91,159,232,0.35);
  --mint: #6FD4B0;
  --mint-soft: rgba(111,212,176,0.16);
  --peach: #FFB59A;
  --peach-soft: rgba(255,181,154,0.2);
  --lavender: #B8A5E3;
  --lavender-soft: rgba(184,165,227,0.2);
  --lemon: #FFE08A;
  --lemon-soft: rgba(255,224,138,0.24);
  --rose: #FFA8B8;
  --rose-soft: rgba(255,168,184,0.22);
  --shadow-sm: 0 4rpx 16rpx rgba(60,120,200,0.06), 0 2rpx 4rpx rgba(60,120,200,0.04);
  --shadow-md: 0 16rpx 48rpx rgba(60,120,200,0.1), 0 8rpx 16rpx rgba(60,120,200,0.06);
  --shadow-lg: 0 48rpx 112rpx rgba(60,120,200,0.16), 0 16rpx 32rpx rgba(60,120,200,0.08);
  --shadow-glow: 0 0 80rpx rgba(91,159,232,0.3);
  --gradient-dream: linear-gradient(135deg,#5B9FE8 0%,#7BC4F0 45%,#6FD4B0 100%);
  --gradient-sky: linear-gradient(180deg,#E1EBF8 0%,#F5F9FE 100%);
  --gradient-aurora: linear-gradient(135deg,#B8A5E3 0%,#5B9FE8 50%,#6FD4B0 100%);
  --radius-card: 40rpx;
  --radius-btn: 24rpx;
  --radius-tag: 999rpx;
  --ease-smooth: cubic-bezier(0.16,1,0.3,1);
}

/* 深色主题 */
page[data-theme="dark"] {
  --bg-base: #0A1428;
  --bg-soft: #0F1B33;
  --bg-card: #13244A;
  --bg-elevated: #1A2F58;
  --bg-glass: rgba(19,36,74,0.72);
  --fg-primary: #EAF2FF;
  --fg-secondary: #A8BBD6;
  --fg-muted: #6B7E9E;
  --border: rgba(123,184,240,0.16);
  --border-strong: rgba(123,184,240,0.36);
  --accent: #7BB8F0;
  --accent-deep: #5B98D0;
  --accent-soft: rgba(123,184,240,0.18);
  --accent-glow: rgba(123,184,240,0.42);
  --mint: #7BD4B5; --peach: #FFB59A; --lavender: #B8A5E3;
  --lemon: #FFE08A; --rose: #FFA8B8;
  --mint-soft: rgba(123,212,181,0.22);
  --peach-soft: rgba(255,181,154,0.24);
  --lavender-soft: rgba(184,165,227,0.24);
  --lemon-soft: rgba(255,224,138,0.26);
  --rose-soft: rgba(255,168,184,0.26);
  --shadow-sm: 0 4rpx 16rpx rgba(0,0,0,0.3);
  --shadow-md: 0 16rpx 48rpx rgba(0,0,0,0.4);
  --shadow-lg: 0 48rpx 112rpx rgba(0,0,0,0.5);
  --shadow-glow: none;
  --gradient-dream: linear-gradient(135deg,#7BB8F0 0%,#9BC8F2 45%,#7BD4B5 100%);
  --gradient-sky: linear-gradient(180deg,#0A1428 0%,#13244A 100%);
  --gradient-aurora: linear-gradient(135deg,#B8A5E3 0%,#7BB8F0 50%,#7BD4B5 100%);
  --radius-card: 40rpx;
  --radius-btn: 24rpx;
  --radius-tag: 999rpx;
}
```

### 2.2 base.wxss（核心样式）

```css
page {
  background-color: var(--bg-base);
  color: var(--fg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  transition: background-color 0.6s, color 0.6s;
}
/* 布局工具类 */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-sm { gap: 12rpx; }
.gap-md { gap: 20rpx; }
/* 横向滚动 */
.h-scroll { white-space: nowrap; overflow-x: auto; }
.h-scroll::-webkit-scrollbar { display: none; }
/* 安全区域 */
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
/* 文字层级 */
.text-h1 { font-size: 44rpx; font-weight: 700; }
.text-h2 { font-size: 36rpx; font-weight: 700; }
.text-h3 { font-size: 32rpx; font-weight: 600; }
.text-body { font-size: 28rpx; }
.text-sm { font-size: 24rpx; color: var(--fg-secondary); }
.text-xs { font-size: 22rpx; color: var(--fg-muted); }
.text-accent { color: var(--accent); }
.glow-text { background: var(--gradient-dream); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
```

### 2.3 animations.wxss

```css
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes spin { to{transform:rotate(360deg)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes slideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
@keyframes pageSlideIn { from{opacity:0.3;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
```

---

## 三、公共组件库

### 3.1 lm-button

```
Properties: type(String:'primary'), size(String:'md'), pill(Boolean:false),
            loading(Boolean:false), disabled(Boolean:false), block(Boolean:false)
Events: bind:tap
```
- type可选：primary(#5B9FE8实底) / gradient(渐变) / secondary(描边) / soft(浅底) / ghost(透明)
- size可选：sm(12rpx padding) / md(20rpx) / lg(28rpx)
- loading时显示旋转spinner，禁用点击
- 按压态 `:active` scale(0.96)
- 深色模式去除发光阴影

### 3.2 lm-card

```
Properties: padding(String:'24rpx'), hoverable(Boolean:false), radius(String:'40rpx')
Slot: default
```
- 背景 var(--bg-card)，边框 var(--border)
- hoverable时点击有轻微上移+阴影增强

### 3.3 lm-tag

```
Properties: color(String:'accent'), size(String:'sm')
```
- color可选：accent/mint/peach/lavender/lemon/rose
- 对应各自的 `-soft` 背景色 + 深色文字

### 3.4 lm-avatar

```
Properties: src(String), size(Number:80), text(String), ring(Boolean:false)
```
- 无src时显示渐变背景+首字text
- ring=true时外圈Aurora渐变旋转动画

### 3.5 lm-input

```
Properties: type(String:'text'), placeholder(String), value(String),
            maxlength(Number:500), icon(String), error(Boolean:false), showCount(Boolean:false)
Events: bind:input, bind:focus, bind:blur
```
- focus态：边框变accent色+外发光
- error态：边框变rose色

### 3.6 lm-switch

```
Properties: checked(Boolean:false), disabled(Boolean:false)
Events: bind:change
```
- 滑块动画 cubic-bezier(0.16,1,0.3,1)

### 3.7 lm-modal

```
Properties: visible(Boolean:false), title(String), content(String),
            showCancel(Boolean:true), confirmText(String:'确认'),
            cancelText(String:'取消'), type(String:'confirm')
Events: bind:confirm, bind:cancel, bind:close
```
- type可选：confirm(双按钮) / alert(单按钮) / delete(红色确认)
- 遮罩fadeIn + 卡片scaleIn动画

### 3.8 lm-bottom-sheet

```
Properties: visible(Boolean:false), title(String), maxHeight(String:'80vh')
Slot: default
Events: bind:close
```
- 底部弹出面板，translateY动画
- 点击遮罩关闭，支持手势下滑关闭
- 顶部拖拽把手指示条

### 3.9 lm-toast

```
调用方式：getApp().showToast({ message, icon:'success', duration:2000 })
```
- 全局单例，顶部居中弹出
- icon可选：success(绿色勾) / error(红色叉) / info(蓝色i) / warning(黄色!)

### 3.10 lm-waterfall

```
Properties: list(Array), columns(Number:2), gap(Number:16)
Slot: item (通过template或slot传入自定义卡片)
Events: bind:loadmore, bind:itemtap
```
- 使用CSS column-count实现两列瀑布流
- 底部loading指示器（加载更多时）
- 空列表时显示lm-empty

### 3.11 lm-skeleton

```
Properties: type(String:'card')
```
- type可选：card(单卡片) / list(列表) / waterfall(瀑布流) / home(首页) / plaza(广场)
- shimmer闪烁动画

### 3.12 lm-empty

```
Properties: icon(String), text(String:'暂无数据'), showAction(Boolean:false), actionText(String)
Events: bind:action
```

### 3.13 lm-left-drawer

```
Properties: visible(Boolean:false)
Events: bind:close
```
- 左侧滑出280rpx宽度面板
- 内容：用户信息头部(Sky渐变背景) + 菜单列表
- 遮罩层点击关闭

### 3.14 lm-image-preview

```
Properties: visible(Boolean:false), urls(Array), current(Number:0)
Events: bind:close, bind:longpress
```
- 全屏黑色遮罩(rgba(0,0,0,0.9))
- 双指缩放（touchstart/touchmove计算距离）
- 长按弹出保存菜单

### 3.15 lm-list-row

```
Properties: icon(String), iconColor(String), title(String), subtitle(String),
            showArrow(Boolean:true), showBadge(Boolean:false), badgeCount(Number:0),
            showSwitch(Boolean:false), switchChecked(Boolean:false)
Events: bind:tap, bind:switch
```

### 3.16 lm-chip

```
Properties: label(String), selected(Boolean:false), variant(String:'filled')
Events: bind:tap
```
- variant可选：filled(实底) / outline(描边)
- 选中态背景accent+白字

### 3.17 custom-tab-bar

自定义TabBar组件，实现创作Tab凸起效果：
- 5个Tab项，创作Tab居中凸起
- 凸起按钮：80rpx圆形，Aurora渐变背景，白色星形图标，发光阴影
- 选中项文字颜色 accent，未选中 fg-muted
- 深色模式适配

---

## 四、工具函数库

### 4.1 cloud.js

```javascript
// 统一云函数调用封装
async function callCloud(name, action, data = {}) {
  try {
    wx.showLoading({ title: '加载中...' });
    const res = await wx.cloud.callFunction({
      name,
      data: { action, data }
    });
    wx.hideLoading();
    if (res.result.code !== 0) {
      wx.showToast({ title: res.result.message, icon: 'none' });
      return null;
    }
    return res.result.data;
  } catch (e) {
    wx.hideLoading();
    wx.showToast({ title: '网络异常', icon: 'none' });
    return null;
  }
}
```

### 4.2 image.js

```javascript
// 上传图片到云存储
async function uploadToCloud(filePath, folder = 'images') {
  const ext = filePath.split('.').pop();
  const cloudPath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const res = await wx.cloud.uploadFile({ cloudPath, filePath });
  return res.fileID;
}

// 保存到相册（含权限检查）
async function saveToAlbum(fileID) {
  await wx.authorize({ scope: 'scope.writePhotosAlbum' });
  const tempRes = await wx.cloud.downloadFile({ fileID });
  await wx.saveImageToPhotosAlbum({ filePath: tempRes.tempFilePath });
  wx.showToast({ title: '已保存', icon: 'success' });
}
```

### 4.3 format.js

```javascript
function formatNumber(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return String(num);
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return '今天';
  const yesterday = new Date(now); yesterday.setDate(now.getDate()-1);
  if (d.toDateString() === yesterday.toDateString()) return '昨天';
  return `${d.getMonth()+1}-${d.getDate()}`;
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min}分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}小时前`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}天前`;
  return formatDate(timestamp);
}
```

### 4.4 storage.js

```javascript
const KEYS = {
  THEME: 'theme',
  USER_INFO: 'userInfo',
  SEARCH_HISTORY: 'searchHistory',
  ONBOARDING_DONE: 'onboardingDone',
  PHONE_BOUND: 'phoneBound',
};

function getSearchHistory() {
  return wx.getStorageSync(KEYS.SEARCH_HISTORY) || [];
}

function addSearchHistory(keyword) {
  let history = getSearchHistory();
  history = history.filter(k => k !== keyword);
  history.unshift(keyword);
  if (history.length > 20) history = history.slice(0, 20);
  wx.setStorageSync(KEYS.SEARCH_HISTORY, history);
}
```

### 4.5 eventBus.js

```javascript
class EventBus {
  constructor() { this.events = {}; }
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(data));
  }
}
// 预定义事件
const EVENTS = {
  THEME_CHANGED: 'THEME_CHANGED',
  CREDITS_CHANGED: 'CREDITS_CHANGED',
  WORK_PUBLISHED: 'WORK_PUBLISHED',
  WORK_DELETED: 'WORK_DELETED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  FOLLOW_CHANGED: 'FOLLOW_CHANGED',
  LIKE_CHANGED: 'LIKE_CHANGED',
  USER_INFO_UPDATED: 'USER_INFO_UPDATED',
};
module.exports = { EventBus, EVENTS };
```

---

## 五、状态管理

### 5.1 globalData 完整结构

```javascript
{
  env: 'prod-xxx',
  openid: 'oXXX...',
  userInfo: {
    _id: 'xxx',
    nickname: '云中漫步',
    avatar: 'cloud://xxx/avatar.jpg',
    credits: 350,
    inviteCode: 'ABC123',
    isMember: false,
    isAdmin: false,
    phoneBound: true,
    stats: { works: 12, likes: 45, followers: 8, following: 15, remakes: 3 }
  },
  theme: 'light',
  systemInfo: { statusBarHeight: 44, ... },
  models: [],   // 从creation.getModels缓存
  styles: [],   // 从creation.getStyles缓存
}
```

### 5.2 页面间通信

| 场景 | 方案 |
|------|------|
| Tab页间共享数据 | app.globalData |
| 二级页返回刷新父页 | EventBus事件 / getCurrentPages() |
| 创作结果传递到发布页 | EventChannel / 页面栈直接传参 |
| 一键同款参数传递 | 页面URL参数 + globalData缓存 |
| 主题切换全局通知 | EventBus THEME_CHANGED |
| 积分变动全局同步 | EventBus CREDITS_CHANGED + 更新globalData |

### 5.3 数据缓存策略

| 数据 | 缓存方式 | 刷新时机 |
|------|---------|---------|
| 模型列表 | globalData + 本地存储 | 1小时过期或手动刷新 |
| 风格列表 | globalData + 本地存储 | 1小时过期 |
| 用户积分 | globalData.userInfo.credits | 每次onShow刷新 |
| 未读消息数 | globalData | 每次mine页onShow刷新 |
| 主题偏好 | 本地存储 | 切换时立即写入 |
| 搜索历史 | 本地存储 | 搜索时追加，手动清空 |

---

## 六、首页（home）

### WXML结构
```
<view class="page-home">
  <!-- Banner走马灯 -->
  <swiper autoplay interval="4000" circular>
    <swiper-item wx:for="{{banners}}" bindtap="onBannerTap" data-item="{{item}}">
      <image src="{{item.image}}" mode="aspectFill" />
    </swiper-item>
  </swiper>

  <!-- 热门玩法 -->
  <view class="section">
    <view class="section-title">热门玩法 <text bindtap="onGameplayAll">全部</text></view>
    <scroll-view scroll-x class="h-scroll">
      <view class="gameplay-card" wx:for="{{gameplays}}" bindtap="onGameplayTap" data-item="{{item}}">
        <image src="{{item.coverImage}}" mode="aspectFill" />
        <text>{{item.name}}</text>
      </view>
    </scroll-view>
  </view>

  <!-- 精选作品 -->
  <view class="section">
    <view class="section-title">精选作品</view>
    <lm-waterfall list="{{works}}" bind:loadmore="onLoadMore" bind:itemtap="onWorkTap" />
  </view>
</view>
```

### data字段
```javascript
{
  banners: [], bannerCurrent: 0,
  gameplays: [],
  works: [], worksPage: 1, worksHasMore: true,
  loading: true, loadingMore: false
}
```

### 事件处理
- `onBannerTap(e)` — 根据 banner.linkType 跳转页面/URL
- `onGameplayTap(e)` — `wx.switchTab` 到创作页 + 携带预设参数
- `onWorkTap(e)` — `wx.navigateTo` 作品详情页
- `onLoadMore()` — worksPage++ 加载更多
- `onGameplayAll()` — 跳转全部玩法页

### 云函数调用
- `works` action: `getHomeData` → 返回 {banners, gameplays, works}
- `works` action: `getHomeWorks({page, pageSize:20})` → 加载更多

### 生命周期
- `onLoad`: 显示骨架屏 → 调用getHomeData → 隐藏骨架屏
- `onPullDownRefresh`: 重新加载全部 → stopPullDownRefresh
- `onReachBottom`: onLoadMore
- `onShareAppMessage`: 返回首页分享卡片

---

## 七、广场（plaza）

### WXML结构
```
<view class="page-plaza">
  <!-- 顶栏 -->
  <view class="plaza-header">
    <view bindtap="toggleDrawer">☰</view>
    <view class="sort-tabs">
      <text wx:for="{{['推荐','热门','最新']}}" class="{{sortIdx===index?'active':''}}" bindtap="switchSort" data-idx="{{index}}">{{item}}</text>
    </view>
    <view bindtap="onSearch">🔍</view>
  </view>

  <!-- 分类Tab -->
  <scroll-view scroll-x class="h-scroll">
    <lm-chip wx:for="{{categories}}" label="{{item.name}}" selected="{{category===item.id}}" bind:tap="switchCategory" data-id="{{item.id}}" />
  </scroll-view>

  <!-- 瀑布流 -->
  <lm-waterfall list="{{works}}" bind:loadmore="onLoadMore" bind:itemtap="onWorkTap" />

  <!-- 左侧抽屉 -->
  <lm-left-drawer visible="{{drawerVisible}}" bind:close="toggleDrawer" />

  <!-- 筛选面板 -->
  <lm-bottom-sheet visible="{{filterVisible}}" title="筛选" bind:close="closeFilter">
    <!-- 分类多选 + 模型多选 + 尺寸多选 + 精度多选 + 重置/确认 -->
  </lm-bottom-sheet>
</view>
```

### data字段
```javascript
{
  sortIdx: 0, // 0推荐 1热门 2最新
  category: 'all',
  categories: [{id:'all',name:'全部'},{id:'anime',name:'二次元'},...],
  works: [], page: 1, hasMore: true,
  filterVisible: false, drawerVisible: false,
  filters: { models:[], ratios:[], quality:[] }
}
```

### 事件处理
- `toggleDrawer()` — drawerVisible = !drawerVisible
- `switchSort(e)` — sortIdx = idx, 重新加载
- `switchCategory(e)` — category = id, 重新加载
- `openFilter()/closeFilter()` — filterVisible切换
- `applyFilter(e)` — 更新filters, 重新加载
- `resetFilter()` — 清空filters
- `onSearch()` — 跳转搜索页
- `onWorkTap(e)` — 跳转作品详情

### 云函数调用
- `works` action: `getPlazaWorks({sort, category, filters, page, pageSize:20})`

### 生命周期
- `onLoad`: 加载分类 → 加载默认推荐作品
- `onPullDownRefresh`: 重新加载
- `onShow`: 检查关注状态变化

---

## 八、创作（create）

### WXML结构
```
<view class="page-create">
  <scroll-view scroll-y class="create-scroll">
    <!-- 模型选择 -->
    <view class="section">
      <view class="section-title">选择模型 <text bindtap="openAllModels">全部</text></view>
      <scroll-view scroll-x class="h-scroll">
        <view class="model-card {{selectedModel._id===item._id?'active':''}}" wx:for="{{models}}" bindtap="selectModel" data-item="{{item}}">
          <image src="{{item.coverImage}}" />
          <text>{{item.name}}</text>
          <text class="text-xs">{{item.baseCredits}}积分/张</text>
        </view>
      </scroll-view>
    </view>

    <!-- 提示词输入 -->
    <view class="section">
      <lm-card>
        <view class="prompt-header">
          <view bindtap="uploadRefImage">+参考图</view>
          <text>{{promptCount}}/500</text>
        </view>
        <image wx:if="{{referenceImage}}" src="{{referenceImage}}" bindtap="previewRefImage" />
        <view wx:if="{{referenceImage}}" class="remove-ref" bindtap="removeRefImage">✕</view>
        <textarea value="{{prompt}}" bindinput="onPromptInput" maxlength="500" placeholder="描述你想创作的画面..." />
        <view class="prompt-footer">
          <view bindtap="clearPrompt">清空</view>
          <view bindtap="navigateToReverse">反推提示词</view>
        </view>
      </lm-card>
    </view>

    <!-- 风格类型 -->
    <view class="section">
      <view class="section-title">风格类型</view>
      <view class="style-grid">
        <view wx:for="{{displayStyles}}" class="style-card {{selectedStyles.includes(item._id)?'active':''}}" bindtap="toggleStyle" data-item="{{item}}">
          <image src="{{item.previewImage}}" />
          <text>{{item.name}}</text>
        </view>
        <view class="style-card more" bindtap="openAllStyles">更多</view>
      </view>
    </view>

    <!-- 图片精度 -->
    <view class="section">
      <view class="section-title">图片精度</view>
      <view class="opt-row">
        <view wx:for="{{['1K','2K','4K']}}" class="opt-card {{quality===item?'active':''}}" bindtap="selectQuality" data-val="{{item}}">
          <text>{{item==='1K'?'全高清':item==='2K'?'超清':'超高清'}}</text>
          <text class="text-xs">{{item}}</text>
        </view>
      </view>
    </view>

    <!-- 画面比例 -->
    <view class="section">
      <view class="section-title">画面比例</view>
      <view class="opt-row">
        <view wx:for="{{['1:1','3:4','4:3','16:9','9:16']}}" class="opt-card {{ratio===item?'active':''}}" bindtap="selectRatio" data-val="{{item}}">
          <view class="ratio-preview {{item}}"></view>
          <text>{{item}}</text>
        </view>
      </view>
    </view>

    <!-- 生成数量 -->
    <view class="section">
      <view class="section-title">生成数量</view>
      <view class="opt-row">
        <view wx:for="{{[1,2,3,4]}}" class="opt-card {{count===item?'active':''}}" bindtap="selectCount" data-val="{{item}}">
          <text>{{item}}张</text>
        </view>
      </view>
    </view>

    <!-- 结果展示 -->
    <view wx:if="{{generating || results.length}}" class="section results-section">
      <view wx:if="{{generating}}" class="generating-state">
        <lm-skeleton type="create" />
        <text>AI创作中... {{completedCount}}/{{count}}</text>
      </view>
      <view class="result-grid">
        <view wx:for="{{results}}" class="result-item {{item.status}}">
          <image wx:if="{{item.status==='success'}}" src="{{item.cloudFileId}}" bindtap="previewResult" data-url="{{item.cloudFileId}}" />
          <view wx:if="{{item.status==='failed'}}" class="failed-item">
            <text>生成失败</text>
            <text class="text-xs">积分已退还</text>
          </view>
        </view>
      </view>
      <view class="result-actions" wx:if="{{completedCount > 0}}">
        <lm-button bind:tap="saveResults">保存图片</lm-button>
        <lm-button type="gradient" bind:tap="publishResults">发布到社区</lm-button>
      </view>
    </view>
  </scroll-view>

  <!-- 底部固定栏 -->
  <view class="create-bottom safe-bottom">
    <text>本次消耗 <text class="text-accent">{{creditCost}}</text> 积分</text>
    <lm-button type="gradient" bind:tap="startCreate" loading="{{submitting}}">开始创作</lm-button>
  </view>
</view>
```

### data字段
```javascript
{
  models: [], selectedModel: null,
  prompt: '', promptCount: 0,
  referenceImage: '', referenceFileID: '',
  displayStyles: [], selectedStyles: [],
  quality: '1K', ratio: '1:1', count: 1,
  taskIds: [], results: [],
  generating: false, submitting: false,
  completedCount: 0, failedCount: 0,
  creditCost: 0, userCredits: 0,
  pollTimer: null
}
```

### 关键事件处理
- `selectModel(e)` — 更新selectedModel + calculateCost()
- `onPromptInput(e)` — prompt = e.detail.value, promptCount = length
- `uploadRefImage()` — wx.chooseMedia → 上传云存储 → referenceFileID
- `toggleStyle(e)` — 追加/移除风格关键词到prompt末尾
- `selectQuality/Ratio/Count(e)` — 更新参数 + calculateCost()
- `calculateCost()` — creditCost = baseCredits × qualityMultiplier × count
- `startCreate()` — 校验积分→安全检查→调用creation.submitTask→开始轮询
- `pollTaskStatus()` — 每3秒调用taskQuery.queryTask，更新results
- `saveResults()` — 遍历成功结果调用saveToAlbum
- `publishResults()` — 跳转发布页携带结果数据

### 云函数调用
- `creation.submitTask({modelId, prompt, referenceFileID, styles, quality, ratio, count})`
- `taskQuery.queryTask({taskId})` — 轮询时用
- `credits.getBalance()` — 检查余额

### 生命周期
- `onLoad(options)`: 加载模型/风格列表，检查预设参数（一键同款/玩法模板）
- `onShow`: 恢复轮询未完成任务
- `onHide`: 暂停轮询
- `onUnload`: 停止轮询

---

## 九、画廊（gallery）

### WXML结构
```
<view class="page-gallery">
  <!-- 个人信息头部 -->
  <view class="gallery-header" style="background:{{headerBg}}">
    <lm-avatar src="{{userInfo.avatar}}" size="120" text="{{userInfo.nickname[0]}}" />
    <text class="text-h3">{{userInfo.nickname}}</text>
    <text class="text-sm">{{userInfo.signature || '这个人很懒'}}</text>
    <view class="stats-row">
      <view><text class="num">{{stats.works}}</text><text class="text-xs">作品</text></view>
      <view><text class="num">{{stats.likes}}</text><text class="text-xs">获赞</text></view>
      <view bindtap="navigateToFollowers"><text class="num">{{stats.followers}}</text><text class="text-xs">粉丝</text></view>
      <view bindtap="navigateToFollowing"><text class="num">{{stats.following}}</text><text class="text-xs">关注</text></view>
    </view>
    <lm-button wx:if="{{isSelf}}" size="sm" bind:tap="editProfile">编辑资料</lm-button>
    <lm-button wx:else size="sm" type="{{isFollowed?'secondary':'primary'}}" bind:tap="toggleFollow">{{isFollowed?'已关注':'关注'}}</lm-button>
  </view>

  <!-- 内容Tab -->
  <view class="tabs">
    <text wx:for="{{tabs}}" class="{{activeTab===item.id?'active':''}}" bindtap="switchTab" data-id="{{item.id}}">{{item.name}}</text>
    <view wx:if="{{isSelf}}" bindtap="toggleManage">管理</view>
  </view>

  <!-- 作品网格 -->
  <lm-waterfall list="{{works}}" bind:loadmore="onLoadMore" bind:itemtap="onWorkTap" />

  <!-- 管理模式底部栏 -->
  <view wx:if="{{manageMode}}" class="manage-bar safe-bottom">
    <text bindtap="selectAll">全选</text>
    <lm-button type="primary" size="sm" bind:tap="deleteSelected">删除({{selectedItems.length}})</lm-button>
  </view>

  <!-- 悬浮发布按钮 -->
  <view wx:if="{{isSelf && !manageMode}}" class="fab" bindtap="navigateToPublish">
    <text>+</text>
  </view>
</view>
```

### data字段
```javascript
{
  isSelf: true, userId: '',
  userInfo: {}, stats: {},
  activeTab: 'all',
  tabs: [{id:'all',name:'全部'},{id:'published',name:'已发布'},{id:'draft',name:'草稿'},{id:'favorite',name:'收藏'}],
  works: [], page: 1, hasMore: true,
  manageMode: false, selectedItems: [],
  isFollowed: false, headerBg: 'var(--gradient-sky)'
}
```

### 事件处理
- `switchTab(e)` — activeTab切换，重新加载
- `toggleManage()` — manageMode切换
- `selectAll()` — 全选/取消
- `deleteSelected()` — lm-modal确认 → works.batchDelete
- `onWorkTap(e)` — 管理模式勾选 / 正常跳详情
- `editProfile()` — 跳转编辑资料
- `toggleFollow()` — community.toggleFollow
- `navigateToPublish()` — 跳转发布页

### 云函数调用
- `works.getUserWorks({userId, tab, page, pageSize:20})`
- `works.getUserStats({userId})`
- `community.toggleFollow({targetUserId})`
- `works.batchDelete({workIds})`

### 生命周期
- `onLoad(options)`: 判断是否自己(isSelf)，加载用户信息和作品
- `onShow`: 刷新作品列表（可能刚发布新作品）

---

## 十、我的（mine）

### WXML结构
```
<view class="page-mine">
  <!-- 用户卡片 -->
  <view class="user-card">
    <lm-avatar src="{{userInfo.avatar}}" size="100" text="{{userInfo.nickname[0]}}" />
    <view>
      <text class="text-h3">{{userInfo.nickname}}</text>
      <text class="text-xs">ID: {{userInfo._id}}</text>
    </view>
    <view class="credits-badge">
      <text class="num">{{credits}}</text>
      <text class="text-xs">积分</text>
    </view>
  </view>

  <!-- 快捷入口四宫格 -->
  <view class="quick-grid">
    <view class="quick-item" bindtap="onRecharge"><view class="icon recharge">💰</view><text>充值</text></view>
    <view class="quick-item" bindtap="onCheckin"><view class="icon checkin">📅</view><text>签到</text></view>
    <view class="quick-item" bindtap="onMembership"><view class="icon member">⭐</view><text>会员</text></view>
    <view class="quick-item" bindtap="onInvite"><view class="icon invite">🎁</view><text>邀请</text></view>
  </view>

  <!-- 菜单列表 -->
  <lm-card>
    <lm-list-row icon="📨" title="消息中心" showBadge="{{unreadCount>0}}" badgeCount="{{unreadCount}}" bind:tap="onMessages" />
    <lm-list-row icon="⚙️" title="设置" bind:tap="onSettings" />
    <lm-list-row icon="📁" title="草稿箱" bind:tap="onDrafts" />
    <lm-list-row icon="🕐" title="浏览记录" bind:tap="onHistory" />
    <lm-list-row icon="❤️" title="我的关注" bind:tap="onFollowing" />
    <lm-list-row icon="👥" title="我的粉丝" bind:tap="onFollowers" />
  </lm-card>

  <lm-card class="mt-20">
    <button open-type="contact" class="contact-btn">📞 联系客服</button>
    <lm-list-row icon="💬" title="意见反馈" bind:tap="onFeedback" />
  </lm-card>
</view>
```

### data字段
```javascript
{ userInfo: null, credits: 0, unreadCount: 0 }
```

### 事件处理
- 各菜单项点击 → `wx.navigateTo` 对应页面
- `onRecharge/Checkin/Membership/Invite/Messages/Settings/History/Feedback` → 跳转

### 云函数调用
- `user.getProfile()` — 刷新用户信息
- `community.getUnreadCount()` — 获取未读消息数

### 生命周期
- `onShow`: 刷新用户信息+积分+未读数

---

## 十一、二级页面规格

### 11.1 搜索页（search）
- **结构**：搜索框(自动聚焦) + 取消按钮 + 默认页(历史+热门) + 结果页(瀑布流)
- **data**：`keyword`, `searchHistory`, `hotSearch`, `results`, `page`, `hasMore`
- **逻辑**：防抖300ms → `search.searchWorks({keyword, page})` → 瀑布流展示
- **历史**：最多20条，新搜索置顶去重，可清空
- **热门**：前3名高亮，带排名序号

### 11.2 反推提示词页（reversePrompt）
- **结构**：上传图片区(虚线框) + 分析按钮(消耗5积分) + 结果区(可编辑文本+复制+带入创作)
- **data**：`imagePath`, `imageFileID`, `analyzing`, `result`
- **流程**：选择图片 → 上传云存储 → 调用reversePrompt.analyze → 显示结果
- **带入创作**：通过EventChannel传递提示词到创作页

### 11.3 作品详情页（workDetail）
- **结构**：大图轮播 + 作者信息栏 + 标题描述 + 提示词(带复制) + 创作信息 + 数据栏 + 底部操作栏
- **data**：`work`(含author), `isLiked`, `isFavorited`, `isFollowed`, `isSelf`
- **底部操作**：点赞/收藏/分享/举报 + 「一键同款」渐变按钮
- **一键同款**：携带 prompt+model+styles+quality+ratio 跳转创作页
- **自己的作品**：额外显示编辑/删除按钮
- **云函数**：`works.getDetail({workId})` + `community.checkInteraction({workId})`

### 11.4 发布页（publish）
- **结构**：作品预览 + 标题(必,30字) + 描述(选,200字) + 标签多选 + 分类单选 + 公开提示词开关 + 发布按钮
- **data**：`draftId`, `title`, `desc`, `tags`, `availableTags`, `showPrompt:true`, `category`
- **发布流程**：内容安全检测(文本+图片) → 通过→更新works.status=published → 不通过→提示修改
- **多入口**：从创作结果/画廊/左侧抽屉进入，自动携带不同数据

### 11.5 编辑资料页（editProfile）
- **结构**：头像更换(chooseMedia) + 昵称输入(20字) + 性别选择 + 签名输入(100字) + 保存按钮
- **云函数**：`user.updateProfile({nickname, gender, signature, avatar})`

### 11.6 充值页（recharge）
- **结构**：积分余额卡片 + 固定档位(4个) + 自定义金额抽屉 + 充值/消费记录Tab
- **data**：`credits`, `tiers`, `activeTab`, `records`
- **支付流程**：选档位 → `payment.createOrder({tier})` → `wx.requestPayment` → 回调确认
- **自定义**：输入金额 → 计算积分(金额×10+5%加赠) → 确认

### 11.7 签到页（checkin）
- **结构**：连续天数大数字 + 签到按钮 + 里程碑奖励(4列) + 本月日历
- **data**：`streak`, `todaySigned`, `milestones`, `calendarDays`
- **签到**：`signin.doSignin()` → +10积分 → 更新连续天数
- **里程碑**：3天+20 / 7天+50 / 14天+100 / 30天+300，状态已领/可领/未达

### 11.8 邀请页（invite）
- **结构**：邀请码(可复制) + 分享按钮 + 已邀请列表 + 规则说明
- **data**：`inviteCode`, `invitedList`, `invitedCount`
- **分享**：`onShareAppMessage` 携带邀请码参数

### 11.9 会员页（membership）
- **结构**：套餐卡片(月18/季48/年168) + 权益展示 + 开通按钮
- **data**：`plans`, `selectedPlan`, `isMember`, `memberExpireAt`
- **开通**：选套餐 → `payment.createMemberOrder({type})` → 支付 → 开通

### 11.10 消息中心（messages）
- **结构**：分类Tab(点赞/收藏/关注/同款/系统/客服) + 全部已读 + 消息列表
- **data**：`categories`, `activeCategory`, `messages`, `page`
- **点击消息**：标记已读 + 跳转对应页面

### 11.11 设置页（settings）
- **结构**：深色模式开关 + 编辑资料 + 手机号管理 + 通知开关 + 个性化推荐 + 协议链接 + 清除缓存 + 版本号
- **深色模式**：lm-switch → `getApp().switchTheme()`
- **清除缓存**：计算缓存大小 → 确认清除
- **版本号**：连续点击5次可进入管理员页

### 11.12 浏览记录页（history）
- **结构**：按时间分组(今天/昨天/更早) + 作品网格 + 清空按钮
- **限制**：最多100条或30天

### 11.13 关注/粉丝列表页（followList）
- **结构**：type切换(following/followers) + 用户列表(头像/昵称/签名+关注按钮)
- **分页**：每页20条

### 11.14 全部模型页（allModels）
- **结构**：完整模型卡片列表(封面/名称/描述/标签/积分) + 当前选中高亮
- **点击**：选择后返回创作页(EventChannel传参)

### 11.15 举报页（report）
- **结构**：举报原因单选(色情低俗/暴力/政治/侵权/虚假/其他) + 补充描述 + 提交
- **云函数**：`report.submit({workId, reason, description})`

### 11.16 意见反馈页（feedback）
- **结构**：反馈类型选择 + 描述文本(500字) + 截图上传(最多2张) + 微信号 + 提交

### 11.17 他人主页（userProfile）
- 复用gallery页面结构，传入userId，强制isSelf=false

### 11.18 编辑作品页（editWork）
- **结构**：与发布页类似但预填已有数据
- **云函数**：`works.updateWork({workId, title, desc, tags})`

---

## 十二、管理员后台

### 12.1 入口与权限
- 设置页版本号连续点击5次 或 特定openid白名单
- 所有管理云函数需校验isAdmin=true

### 12.2 管理首页
- 数据概览四卡片：总用户/总作品/今日生成/今日收入
- 内容管理入口：Banner/模型/风格/玩法/作品
- 举报队列(带红点)

### 12.3 管理子页

| 页面 | 功能 |
|------|------|
| Banner管理 | 列表+新增/编辑(图片+标题+链接+排序+上下线) |
| 模型管理 | 列表+新增/编辑(封面+名称+描述+kid+积分+精度+上下线) |
| 风格管理 | 列表+新增/编辑(预览图+名称+关键词+排序) |
| 玩法模板管理 | 列表+新增/编辑(封面+名称+预设提示词+推荐参数) |
| 作品管理 | 列表+搜索+筛选+下架/恢复 |
| 举报处理 | 待处理列表+举报详情+确认违规/误报恢复 |
| 用户管理 | 搜索+分页+封禁/解封 |
| 积分规则 | 签到/邀请/充值比例配置 |
| 审核设置 | 举报阈值/自动隐藏规则 |

---

## 十三、云函数规格

每个云函数使用统一入口模式：`exports.main = async (event) => { switch(event.action) {...} }`
统一响应：`{ code: 0, message: 'success', data: {...} }` / `{ code: Number, message: String }`

### 13.1 user

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| login | - | {openid, userInfo} | 获取/创建用户，新用户赠100积分 |
| getProfile | - | userInfo | 返回当前用户完整信息 |
| updateProfile | {nickname,gender,signature,avatar} | userInfo | 更新个人资料 |
| bindPhone | {code} | {phone,phoneBound:true} | 获取手机号并绑定 |
| submitFeedback | {type,desc,images,wechat} | {success:true} | 提交反馈 |

### 13.2 credits

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| getBalance | - | {credits} | 返回当前积分余额 |
| deduct | {amount,reason,relatedId} | {balance} | 预扣积分，校验余额充足 |
| refund | {amount,reason,relatedId} | {balance} | 退还积分，防重复 |
| addCredits | {amount,reason,relatedId} | {balance} | 增加积分 |
| getRecords | {type,page,pageSize} | {records,total} | 积分流水记录 |

### 13.3 signin

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| doSignin | - | {streak,credits,milestone} | 签到+10积分，计算连续天数 |
| getStatus | - | {streak,todaySigned,calendar,milestones} | 签到状态+日历+里程碑 |
| claimMilestone | {days} | {credits} | 领取里程碑奖励 |

### 13.4 invitation

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| getInviteCode | - | {inviteCode,inviteCount} | 获取邀请码+已邀人数 |
| submitInviteCode | {code} | {success,credits} | 新用户填写邀请码 |
| getInvitedList | {page,pageSize} | {list,total} | 已邀请用户列表 |

### 13.5 creation

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| submitTask | {modelId,prompt,referenceFileID,styles,quality,ratio,count} | {taskIds} | 核心：提交创作任务 |
| getModels | - | {models} | 获取启用模型列表 |
| getStyles | - | {styles} | 获取启用风格列表 |

**submitTask完整流程**：
1. 校验参数合法性
2. msgSecCheck检测提示词
3. 计算消耗 = baseCredits × qualityMul × count
4. 校验积分余额
5. 原子扣减积分
6. 循环count次调用kie.ai createTask
7. 写入tasks集合(status:pending)
8. 写入works集合(status:generating)
9. 返回taskIds

### 13.6 taskQuery

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| queryTask | {taskId} | {status,resultUrl,cloudFileId} | 查询单个任务状态 |
| batchQuery | {taskIds} | {tasks[]} | 批量查询 |

**queryTask完整流程**：
1. 调用kie.ai recordInfo
2. 成功：下载图片→添加AIGC水印→上传云存储→更新works和tasks
3. 失败：更新tasks状态→退还积分→记录原因
4. 返回状态和结果

### 13.7 reversePrompt

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| analyze | {imageFileID} | {prompt} | 图片分析生成提示词，消耗5积分 |

### 13.8 works

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| publish | {workId,title,desc,tags,category,showPrompt} | {work} | 发布作品(含内容安全检测) |
| getDetail | {workId} | {work,isLiked,isFavorited} | 作品详情+互动状态 |
| getUserWorks | {userId,tab,page,pageSize} | {works,total} | 用户作品分页 |
| getUserStats | {userId} | {works,likes,followers,following,remakes} | 统计数据 |
| deleteWork | {workId} | {success} | 删除作品 |
| batchDelete | {workIds} | {success} | 批量删除 |
| updateWork | {workId,title,desc,tags} | {work} | 编辑作品 |
| getHomeBanners | - | {banners} | 首页Banner |
| getHomeGameplays | - | {gameplays} | 热门玩法 |
| getHomeWorks | {page,pageSize} | {works,hasMore} | 精选作品 |
| getPlazaWorks | {sort,category,filters,page,pageSize} | {works,hasMore} | 广场作品 |

### 13.9 community

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| toggleLike | {workId} | {liked,likeCount} | 点赞/取消 |
| toggleFavorite | {workId} | {favorited} | 收藏/取消 |
| toggleFollow | {targetUserId} | {followed} | 关注/取关 |
| remakeWork | {workId} | {work} | 一键同款(返回作品参数) |
| checkInteraction | {workId} | {isLiked,isFavorited,isFollowed} | 查互动状态 |
| getFollowList | {type,page,pageSize} | {users,total} | 关注/粉丝列表 |
| addBrowseHistory | {workId} | - | 记录浏览 |

### 13.10 search

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| searchWorks | {keyword,page,pageSize} | {works,hasMore} | 搜索作品 |
| getHotSearch | - | {keywords} | 热门搜索词 |

### 13.11 report

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| submit | {workId,reason,description} | {success} | 提交举报，达阈值自动隐藏 |

### 13.12 admin

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| getStats | - | {totalUsers,totalWorks,todayGen,todayRevenue} | 数据概览 |
| crudBanners | {op,data} | {banner/banners} | Banner CRUD |
| crudModels | {op,data} | {model/models} | 模型 CRUD |
| crudStyles | {op,data} | {style/styles} | 风格 CRUD |
| crudGameplays | {op,data} | {gameplay/gameplays} | 玩法 CRUD |
| getReports | {status,page} | {reports,total} | 举报列表 |
| handleReport | {reportId,action} | {success} | 处理举报(确认/误报) |
| getUsers | {keyword,page} | {users,total} | 用户列表 |
| banUser | {userId,days} | {success} | 封禁用户 |
| hideWork | {workId} | {success} | 下架作品 |
| updatePointsRules | {rules} | {success} | 更新积分规则 |

### 13.13 payment

| action | 输入 | 输出 | 说明 |
|--------|------|------|------|
| createOrder | {tier} | {payParams} | 创建充值订单+返回支付参数 |
| payCallback | {orderNo} | {success,credits} | 支付回调(积分到账) |
| createMemberOrder | {type} | {payParams} | 会员订阅下单 |
| memberPayCallback | {orderNo} | {success} | 会员支付回调(开通会员) |

---

## 十四、数据库集合规格

### 14.1 users

| 字段 | 类型 | 必填 | 默认值 |
|------|------|------|-------|
| _id | String | auto | - |
| openid | String | ✓ | - |
| nickname | String | - | "绘光用户" |
| avatar | String | - | "" |
| gender | String | - | "unknown" |
| signature | String | - | "" |
| phone | String | - | "" |
| phoneBound | Boolean | - | false |
| credits | Number | - | 100 |
| inviteCode | String | - | auto(userId后6位) |
| inviteCount | Number | - | 0 |
| invitedBy | String | - | "" |
| isMember | Boolean | - | false |
| memberType | String | - | null |
| memberExpireAt | Date | - | null |
| memberLastClaim | Date | - | null |
| isAdmin | Boolean | - | false |
| isBanned | Boolean | - | false |
| banExpireAt | Date | - | null |
| theme | String | - | "light" |
| stats | Object | - | {works:0,likes:0,followers:0,following:0,remakes:0} |
| createdAt | Date | auto | - |
| updatedAt | Date | auto | - |

**索引**：openid(unique), inviteCode(unique), createdAt(desc)

### 14.2 works

| 字段 | 类型 | 必填 | 默认值 |
|------|------|------|-------|
| _id | String | auto | - |
| authorId | String | ✓ | - |
| author | Object | ✓ | {nickname,avatar} |
| title | String | - | "" |
| description | String | - | "" |
| images | Array | ✓ | [fileID...] |
| prompt | String | ✓ | - |
| showPrompt | Boolean | - | true |
| modelId | String | ✓ | - |
| modelName | String | ✓ | - |
| quality | String | ✓ | "1K" |
| ratio | String | ✓ | "1:1" |
| styles | Array | - | [] |
| tags | Array | - | [] |
| category | String | - | "" |
| status | String | ✓ | "generating" |
| isAIGC | Boolean | - | true |
| stats | Object | - | {likes:0,favorites:0,remakes:0,views:0} |
| creditCost | Number | ✓ | - |
| taskId | String | ✓ | - |
| expireAt | Date | - | createdAt+30d |
| publishedAt | Date | - | null |
| createdAt | Date | auto | - |
| updatedAt | Date | auto | - |

**索引**：authorId+status, status+publishedAt(desc), category+status, stats.likes(desc)

### 14.3 tasks

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | String | 用户ID |
| workId | String | 关联works |
| kieTaskId | String | kie.ai任务ID |
| modelId, modelName | String | 模型信息 |
| prompt | String | 提示词 |
| referenceImage | String | 参考图fileID |
| quality, ratio | String | 精度/比例 |
| styleKeywords | String | 风格关键词 |
| status | String | pending/processing/success/failed/timeout |
| resultUrl | String | kie.ai图片URL |
| cloudFileId | String | 云存储fileID |
| errorMessage | String | 失败原因 |
| creditCost | Number | 消耗积分 |
| creditRefunded | Boolean | 是否已退还 |
| createdAt, updatedAt | Date | 时间戳 |

**索引**：userId+status, kieTaskId

### 14.4 其他集合快速参考

| 集合 | 核心字段 | 索引 |
|------|---------|------|
| credits_log | userId, type(earn/spend), amount, reason, relatedId, balanceBefore, balanceAfter | userId+createdAt |
| signins | userId, date(YYYY-MM-DD), streak, credits, milestoneClaimed[] | userId+date(unique) |
| invitations | inviterId, inviteeId, inviteCode, inviterCredits(50), inviteeCredits(30) | inviteeId(unique) |
| likes | userId, workId | userId+workId(unique) |
| favorites | userId, workId | userId+workId(unique) |
| follows | followerId, followingId | followerId+followingId(unique) |
| messages | userId, type, fromUser{}, workId, content, isRead | userId+isRead+createdAt |
| reports | reporterId, workId, reason, status, adminAction | status+createdAt |
| models | name, kieModelId, baseCredits, supportedQuality[], coverImage, isActive, order | order |
| styles | name, keywords, previewImage, isActive, order | order |
| banners | image, title, link, isActive, order | order |
| gameplays | name, coverImage, presetPrompt, presetParams{}, isActive, order | order |
| recharge_orders | userId, tier, amount, totalCredits, paymentId, status, orderType | userId+createdAt |
| browse_history | userId, workId, workCover | userId+createdAt |
| drafts | userId, workId, title, taskIds[] | userId+createdAt |
| config | key, value | key(unique) |

---

## 十五、第三方集成规格

### 15.1 kie.ai API封装

位置：`cloudfunctions/creation/lib/kieClient.js`

```javascript
const https = require('https');
const KIE_BASE = 'https://api.kie.ai/api/v1';
const API_KEY = process.env.KIE_API_KEY;

async function createTask({model, prompt, aspectRatio, resolution}) {
  const body = JSON.stringify({
    model, // 从 models集合的 kieModelId 获取
    input: { prompt, aspect_ratio: aspectRatio, resolution }
  });
  return request('/jobs/createTask', 'POST', body);
  // 返回 {code:200, data:{taskId:'task_xxx'}}
}

async function queryRecord(taskId) {
  return request(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
  // 返回 {code:200, data:{status, result:{image_url}}}
}

function request(path, method, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(KIE_BASE + path);
    const options = {
      hostname: url.hostname, path: url.pathname + url.search,
      method, headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
```

### 15.2 微信支付

```javascript
// payment云函数中
async function createOrder(openid, tier) {
  const tierConfig = TIER_MAP[tier]; // 档位配置
  const orderNo = `RC${Date.now()}${Math.random().toString(36).slice(2,8)}`;
  // 1. 写入recharge_orders
  // 2. 调用微信支付统一下单
  const payResult = await cloud.cloudPay.unifiedOrder({
    body: '绘光积分充值',
    outTradeNo: orderNo,
    totalFee: tierConfig.price * 100, // 分
    envId: cloud.DYNAMIC_CURRENT_ENV,
    functionName: 'payment', // 回调云函数
    nonceStr: generateNonce(),
    tradeType: 'JSAPI'
  });
  return payResult.payment; // 前端wx.requestPayment的参数
}
```

### 15.3 内容安全

```javascript
// 文本检测
async function checkText(content) {
  try {
    await cloud.openapi.security.msgSecCheck({ content });
    return { pass: true };
  } catch (e) {
    return { pass: false, reason: e.errMsg };
  }
}

// 图片检测(异步)
async function checkImage(mediaUrl) {
  const result = await cloud.openapi.security.mediaCheckAsync({
    mediaUrl, mediaType: 2 // 2=图片
  });
  return result; // 异步结果通过回调获取
}
```

### 15.4 微信登录

```javascript
// 手机号获取：前端button组件
// <button open-type="getPhoneNumber" bindgetphonenumber="onGetPhone">

// 云函数中获取手机号
async function bindPhone(code) {
  const result = await cloud.openapi.phonenumber.getPhoneNumber({ code });
  return result.phoneInfo.purePhoneNumber;
}
```

### 15.5 AIGC水印

```javascript
// 在图片下载后、上传云存储前添加
// 使用canvas或sharp库在右下角添加半透明"AI生成"文字水印
async function addAIGCWatermark(imageBuffer) {
  // 右下角添加半透明文字
  // 返回加水印后的图片buffer
}
```

---

## 十六、弹窗与抽屉规格

| 弹窗 | 组件 | 触发场景 | 内容 |
|------|------|---------|------|
| 左侧抽屉 | lm-left-drawer | 广场页汉堡菜单 | 用户信息+快捷入口+菜单 |
| 广场筛选 | lm-bottom-sheet | 广场页筛选按钮 | 分类+模型+尺寸+精度多选 |
| 全部风格 | lm-bottom-sheet | 创作页"更多" | 3列网格风格卡片多选 |
| 模型选择 | lm-bottom-sheet | 创作页"全部" | 完整模型卡片列表 |
| 手机号绑定 | lm-modal | 未绑定手机时创作/发布 | 提示+getPhoneNumber按钮 |
| 邀请码引导 | lm-modal | 新用户首次进入 | 邀请码输入+确认/跳过 |
| 图片预览 | lm-image-preview | 点击任何图片 | 全屏+缩放+长按保存 |
| 删除确认 | lm-modal(type:delete) | 删除操作 | 警告文案+取消/确认 |
| 作品管理 | lm-bottom-sheet | 画廊页点击作品 | 发布/编辑/同款/保存/删除 |
| 画廊背景 | lm-bottom-sheet | 画廊背景设置 | 纯色网格+渐变选择 |
| 自定义充值 | lm-bottom-sheet | 充值页自定义 | 金额输入+积分计算 |
| 草稿选择 | lm-bottom-sheet | 发布页从草稿选 | 3列网格草稿缩略图 |
| 长按操作 | lm-bottom-sheet | 瀑布流长按 | 点赞/收藏/分享/举报 |

---

## 十七、Tab栏与导航规格

### 17.1 自定义TabBar

实现位置：`miniprogram/custom-tab-bar/`

```json
// custom-tab-bar/index.json
{ "component": true }
```

- 5个Tab项，创作Tab居中凸起
- 凸起按钮：80rpx圆形，Aurora渐变（薰衣草→天青蓝→薄荷），白色星形图标
- Tab切换：`this.getTabBar().setData({selected: idx})`
- 深色模式：Tab栏背景切换 + 创作按钮阴影调整

### 17.2 导航配置

| 页面 | 标题 | 特殊配置 |
|------|------|--------|
| 首页 | 绘光 | 自定义导航栏 |
| 广场 | 广场 | 隐藏原生导航，自定义顶栏 |
| 创作 | 创作 | 默认 |
| 画廊 | 画廊 | 透明导航栏(头部背景穿透) |
| 我的 | 我的 | 默认 |
| 二级页 | 各自标题 | 默认返回按钮 |

### 17.3 分享配置

| 页面 | 分享标题 | 分享图片 | 路径 |
|------|---------|---------|------|
| 首页 | 绘光-AI绘画创作平台 | 品牌封面 | /pages/home/index |
| 作品详情 | {作品标题} | 作品图片 | /pages/subpkg-community/workDetail/index?id={workId} |
| 创作 | 来绘光创作AI艺术 | 创作示例 | /pages/create/index |
| 邀请 | 来绘光，领100积分！ | 邀请卡片 | /pages/home/index?inviteCode={code} |

---

## 十八、性能优化与工程规范

### 18.1 代码规范

- **文件命名**：camelCase (如 `eventBus.js`)
- **组件命名**：kebab-case (如 `lm-button`)
- **事件命名**：`onXxx` (如 `onBannerTap`)
- **常量命名**：UPPER_SNAKE_CASE (如 `MAX_PROMPT_LENGTH`)
- **CSS类名**：kebab-case (如 `model-card`)

### 18.2 图片优化

- 瀑布流图片使用 `lazy-load` 属性
- 列表页使用缩略图：云存储URL + 裁剪参数 `/imageView2/2/w/400`
- 详情页使用原图
- 占位图：使用 lm-skeleton 而非静态图

### 18.3 列表性能

- 瀑布流分页：每顢20条
- `onReachBottom` 触底加载，距底500rpx触发
- 避免在setData中传递大数组，使用局部更新

### 18.4 兼容性

- 基础库最低版本：2.20.1
- `wx.chooseMedia` 替代已废弃的 `wx.chooseImage`
- 深色模式：iOS 13+/Android 10+，低版本强制浅色
- `backdrop-filter`：基础库2.25+支持，低版本降级为半透明纯色背景

### 18.5 错误处理

所有云函数调用统一通过 `utils/cloud.js` 封装：
- 网络异常：Toast提示"网络异常，请重试"
- 业务错误：Toast显示服务端返回的错误信息
- 积分不足：弹窗提示+跳转充值页
- 未绑定手机：弹出绑定弹窗
- 内容违规：高亮违规内容，提示修改

---

> **文档完成**：本Spec覆盖了项目初始化、设计系统、16个公共组件、7个工具函数、5个Tab页、20+二级页、管理员后台、13个云函数、19个数据库集合、第三方集成、14个弹窗、Tab栏导航以及工程规范。开发者可按此文档逐模块实现。
