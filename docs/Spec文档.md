# 露米画板 - 实施规格书（Spec）

> 每个阶段解耦实施，完成后验证，确保可拓展性和后期维护迭代。  
> UI 以 `prototype/mobile-prototype.html` 为唯一参考源，文档不描述具体样式。

---

## Phase 1：基础框架搭建

### 目标
建立可运行的项目骨架，5个Tab页能正常切换，云环境连接成功。

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `miniprogram/app.js` | 修改 | 云环境初始化为 `cloud1-d9g2e4d5cedc3365`，onLaunch 调用登录 |
| `miniprogram/app.json` | 修改 | 注册所有页面路由，配置 TabBar（5个Tab），窗口样式 |
| `miniprogram/app.wxss` | 修改 | 全局基础框架样式（页面重置、通用类） |
| `project.config.json` | 修改 | projectname 改为 `lumi-draw` |
| `miniprogram/utils/api.js` | 新建 | `call(action, data)` 统一封装 wx.cloud.callFunction |
| `miniprogram/utils/util.js` | 新建 | showToast、showLoading、formatTime、throttle、debounce |
| `miniprogram/utils/config.js` | 新建 | CLOUD_ENV_ID、MODELS、QUALITIES、RATIOS 等常量 |
| `miniprogram/utils/auth.js` | 新建 | checkLogin、getUserInfo、refreshUserInfo |

### TabBar 配置
```
首页  → pages/home/index      图标: home / home-active
广场  → pages/plaza/index     图标: compass / compass-active
创作  → pages/create/index    图标: sketching / sketching-active (中间凸起)
画廊  → pages/gallery/index   图标: gallery / gallery-active
我的  → pages/mine/index      图标: user / user-active
```

### app.json 页面路由（主包）
```
pages/home/index
pages/plaza/index
pages/create/index
pages/gallery/index
pages/mine/index
pages/editProfile/index
pages/search/index
pages/workDetail/index
pages/settings/index
pages/feedback/index
pages/recharge/index
pages/checkin/index
pages/membership/index
pages/invite/index
pages/messages/index
pages/msgDetail/index
pages/publish/index
pages/editWork/index
pages/reversePrompt/index
pages/userProfile/index
pages/followList/index
pages/history/index
pages/report/index
pages/allModels/index
pages/allGameplays/index
```

### app.json 分包配置（管理后台）
```
subpackages:
  - root: pages/admin
    pages:
      index/index
      statUsers/index
      statWorks/index
      statGen/index
      statRevenue/index
      banner/index
      bannerEdit/index
      model/index
      modelEdit/index
      style/index
      styleEdit/index
      gameplay/index
      gameplayEdit/index
      works/index
      workDetail/index
      reports/index
      reportDetail/index
      users/index
      userDetail/index
      userWorks/index
      points/index
      audit/index
```

### 实现要点
- 创作页 Tab 图标使用渐变色圆形凸起样式（参考原型图 tab-item.center）
- 创作 Tab 下方固定创作栏（create-bottom），仅创作页显示
- 画廊页显示悬浮发布按钮（右下角圆形）
- 各 Tab 页创建空白占位，后续逐步填充

### 验证
- [ ] 微信开发者工具编译无报错
- [ ] 5个 Tab 页切换正常
- [ ] 云环境连接成功（控制台无 wx.cloud.init 报错）
- [ ] TabBar 图标显示正确

---

## Phase 2：数据库集合 & 云函数基础设施

### 目标
创建全部数据库集合，搭建云函数入口框架，完成用户登录。

### 操作（通过云开发 MCP）

**创建数据库集合（16个）**：
users, works, models, styles, banners, gameplays, messages, credits, feedbacks, reports, checkins, invitations, memberships, categories, settings, follows

**创建云函数**：
| 文件 | 说明 |
|------|------|
| `cloudfunctions/main/index.js` | 主入口，action 路由分发框架 |
| `cloudfunctions/main/package.json` | 依赖：wx-server-sdk, axios |
| `cloudfunctions/main/config.json` | 云函数配置 |

**初始化数据**：
- `models`：4个模型（Nano Banana 2 / GPT Image 2 / Nano Banana Pro / Seedream 4.5）
- `styles`：15种风格
- `categories`：全部、二次元、风景、建筑、表情包、写实、国风、人像、动物、抽象
- `banners`：4个初始轮播图
- `gameplays`：8个玩法模板（人物美颜/证件照/宠物头像/古风国潮/Q版头像/Logo设计/壁纸/表情包）
- `settings`：积分规则、审核阈值、签到规则等

**实现 action 路由框架**（先实现以下核心 action）：
- `user.login` — 获取 openid，查询或创建用户，返回用户信息
- `user.getProfile` — 获取用户信息
- `user.updateProfile` — 更新昵称/头像/性别/签名
- `content.getBanners` — 获取上架中的轮播图
- `content.getModels` — 获取启用的模型列表
- `content.getStyles` — 获取启用的风格列表
- `content.getGameplays` — 获取启用的玩法列表
- `content.getCategories` — 获取启用的分类列表

### 验证
- [ ] 云开发控制台可见所有 16 个集合
- [ ] 云函数 main 部署成功
- [ ] 调用 `user.login` 返回正常用户数据
- [ ] 初始化数据写入成功

---

## Phase 3：通用组件库

### 目标
搭建项目核心复用组件。

### 文件变更

| 组件 | 说明 | Props |
|------|------|-------|
| `components/waterfall/` | 瀑布流 | works(数组), showPublished(布尔), bind:itemclick, bind:longpress |
| `components/bottom-sheet/` | 底部弹窗 | visible(布尔), bind:close |
| `components/left-drawer/` | 左侧抽屉 | visible(布尔), bind:close |
| `components/confirm-dialog/` | 确认对话框 | visible, title, message, confirmText, confirmColor, bind:confirm, bind:cancel |
| `components/image-preview/` | 图片预览 | visible, src, showSave(布尔), bind:close, bind:save |
| `components/empty-state/` | 空状态 | icon, text, subText, buttonText, bind:action |
| `components/load-more/` | 加载更多 | status(loading/noMore/hidden) |
| `components/skeleton/` | 骨架屏 | type(home/list) |

### 实现要点
- waterfall 使用微信小程序的 column-count 或双列 flex 布局
- bottom-sheet 支持手势下滑关闭
- left-drawer 带遮罩层
- confirm-dialog 居中弹出，带遮罩
- image-preview 全屏黑色遮罩 + 图片缩放动画

### 验证
- [ ] 各组件在测试页面独立渲染正常
- [ ] Props 传递和事件触发正确
- [ ] 弹窗类组件动画流畅

---

## Phase 4：首页（home）

### 目标
完成首页全部功能。

### 文件变更
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/home/index.js` | 新建 |
| `miniprogram/pages/home/index.wxml` | 新建 |
| `miniprogram/pages/home/index.wxss` | 新建 |
| `miniprogram/pages/home/index.json` | 新建 |

### 实现要点

**Banner 轮播**：
- 使用 swiper 组件，autoplay=true，interval=4000
- 4个指示点（当前项宽度拉长为圆角矩形）
- 点击 Banner 跳转对应页面

**热门玩法**：
- scroll-view horizontal，8个卡片
- 点击跳转创作页并 Toast 提示"已套用模板"

**精选作品瀑布流**：
- 推荐/最新 Tab 切换（带下划线指示器动画）
- 切换时显示加载 spinner 300ms
- 使用 waterfall 组件渲染
- 下拉加载更多

**骨架屏**：
- 首次加载显示骨架屏 800ms
- 加载完成后淡出切换为真实内容

**长按菜单**：
- 长按作品卡片弹出底部操作（点赞/收藏/分享/举报）

### 验证
- [ ] Banner 自动/手动切换正常
- [ ] 热门玩法横滚流畅
- [ ] 推荐/最新 Tab 切换有加载动画
- [ ] 瀑布流双列显示正常
- [ ] 骨架屏 → 内容过渡自然
- [ ] 点击卡片跳转作品详情

---

## Phase 5：广场页（plaza）

### 目标
完成广场页全部功能。

### 文件变更
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/plaza/index.js` | 新建 |
| `miniprogram/pages/plaza/index.wxml` | 新建 |
| `miniprogram/pages/plaza/index.wxss` | 新建 |
| `miniprogram/pages/plaza/index.json` | 新建 |
| `miniprogram/components/filter-drawer/` | 新建（筛选抽屉） |

### 实现要点

**顶部栏**：
- 左：菜单按钮（打开左抽屉）
- 中：推荐/热门/最新 Tab（带指示器）
- 右：搜索按钮（跳转搜索页）

**分类 chips**：
- scroll-view horizontal，10个分类
- 点击高亮并刷新数据

**筛选抽屉**（filter-drawer 组件）：
- 底部弹出，4个维度：分类/模型/尺寸/精度
- 支持多选 chip 切换
- 重置/确认按钮

**瀑布流**：
- 复用 waterfall 组件
- 下拉加载更多

**左抽屉**：
- 复用 left-drawer 组件
- 用户信息 + 4宫格快捷入口 + 功能列表

### 验证
- [ ] 三 Tab 切换数据刷新，有滑动动画
- [ ] 分类 chips 点击高亮并过滤
- [ ] 筛选抽屉弹出/收起动画正常
- [ ] 左抽屉打开/关闭正常
- [ ] 瀑布流加载更多

---

## Phase 6：创作页（create）— 配置区域

### 目标
完成创作页所有配置选项。

### 文件变更
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/create/index.js` | 新建 |
| `miniprogram/pages/create/index.wxml` | 新建 |
| `miniprogram/pages/create/index.wxss` | 新建 |
| `miniprogram/pages/create/index.json` | 新建 |
| `miniprogram/components/model-selector/` | 新建 |
| `miniprogram/components/style-selector/` | 新建 |

### 实现要点

**模型选择**：
- 当前模型卡片（显示名称/描述/标签/积分）
- 点击打开 model-selector 底部抽屉（全部4个模型列表）
- 切换后更新积分消耗

**提示词输入**：
- textarea，500字限制，实时计数
- 清除按钮（有内容时显示）
- 上传图片按钮（wx.chooseImage → 预览 → 可删除）
- 反推提示词入口标签

**风格选择**：
- 4列网格，显示前7个风格 + "更多"按钮
- 点击风格高亮选中
- "更多"弹出 style-selector（全部15个风格 3列网格）

**精度选择**：
- 3个胶囊按钮（全高清1K / 超清2K / 超高清4K）

**画面比例**：
- 4列网格显示（1:1/3:4/4:3/16:9）
- "全部尺寸"弹出底部弹窗显示全部5个比例

**生成数量**：
- 横排4个选项（1/2/3/4张）

**底部创作栏**：
- 固定在页面底部（非 TabBar 底部）
- 左侧：积分消耗（模型单价 × 数量）
- 右侧：开始创作按钮（渐变色）
- 仅创作页显示

### 验证
- [ ] 模型切换后积分实时更新
- [ ] 提示词计数正确，清除功能正常
- [ ] 图片上传预览和删除正常
- [ ] 风格选择高亮正确
- [ ] 数量改变积分实时更新
- [ ] 底部栏固定显示

---

## Phase 7：创作页（create）— AI 生图 & 结果展示

### 目标
实现完整的 AI 生图流程。

### 文件变更
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/create/index.js` | 修改（新增生成逻辑） |
| `miniprogram/pages/create/index.wxml` | 修改（新增结果区域） |
| `cloudfunctions/main/index.js` | 修改（新增 ai 模块 action） |
| `miniprogram/components/gen-progress/` | 新建 |
| `miniprogram/components/gen-result/` | 新建 |

### 实现要点

**云函数 ai 模块**：
- `ai.generateImage`：校验积分 → 调用 kie.ai 提交任务 → 返回 taskId
- `ai.getTaskStatus`：查询 kie.ai 任务状态
- `ai.reversePrompt`：下载图片 → base64 → 调用分析接口 → 返回文本
- 生成完成后：下载图片 → 上传云存储 → 获取 fileID → 创建 works 记录

**生成进度组件（gen-progress）**：
- SVG 环形进度条（使用 canvas 或 path）
- 百分比数字
- 阶段文字（解析提示词→构建构图→AI绘制→细节优化→渲染输出）
- 进度条
- 底部信息（消耗积分/模型/预计时间）

**生成结果组件（gen-result）**：
- 2列网格展示生成的图片
- 失败的显示错误图标 + 错误信息 + 重试按钮
- 底部信息：耗时/分辨率/文件大小/模型
- 操作按钮：发布作品 / 全部保存
- 保存进度动画（百分比→成功）

**积分逻辑**：
- 生图前预扣积分（模型单价 × 数量）
- 完成后退还失败张数的积分
- 记录 credits 流水

**画廊任务卡片**：
- 生图任务进行中时，画廊页顶部显示任务卡片
- 实时更新进度（通过 globalData 或 eventChannel 同步）

### 验证
- [ ] 点击创作后进度动画正常显示
- [ ] 生成完成图片正确显示
- [ ] 失败图片可单独重试
- [ ] 积分正确扣减和退还
- [ ] 保存后草稿箱可见
- [ ] 画廊任务卡片实时更新

---

## Phase 8：画廊页（gallery）

### 目标
完成画廊页全部功能。

### 文件变更
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/gallery/index.js` | 新建 |
| `miniprogram/pages/gallery/index.wxml` | 新建 |
| `miniprogram/pages/gallery/index.wxss` | 新建 |
| `miniprogram/pages/gallery/index.json` | 新建 |
| `miniprogram/components/work-manage-sheet/` | 新建 |

### 实现要点

**头部区域**：
- 左抽屉菜单按钮
- 头像（可更换，带+号角标）
- 昵称 + ID + 性别标签
- 个性签名
- 标签（AI创作者）
- 统计行：作品数/粉丝数/获赞数
- 编辑资料按钮

**子 Tab**：
- 全部 / 已发布 / 草稿箱 / 收藏
- 下划线指示器跟随动画
- 切换时显示加载 spinner

**管理模式**：
- 点击"管理"按钮进入
- 每个作品卡片左上角出现圆形勾选覆盖层
- 底部出现操作栏（已选数量 + 全选 + 删除）
- 删除弹出确认对话框
- 点击"完成"退出管理模式

**背景设置**：
- 底部弹窗选择颜色（10色）或渐变（8种）
- 切换后头部区域背景变化

**生成任务卡片**：
- 顶部显示正在生成的任务
- 环形进度 + 阶段文字 + 模型信息
- 动画背景（shimmer 效果）

**空状态**：
- 不同 Tab 不同提示（参考原型图 _galleryEmptyMap）
- 部分空状态带引导按钮

**悬浮发布按钮**：
- 右下角圆形按钮
- 跳转发布页

### 验证
- [ ] 头部信息正确显示
- [ ] 4个子 Tab 切换数据正确
- [ ] 管理模式覆盖层动画流畅
- [ ] 批量删除功能正常
- [ ] 背景切换生效
- [ ] 生成任务卡片实时更新
- [ ] 空状态显示正确

---

## Phase 9：我的页（mine）

### 目标
完成我的页全部功能。

### 文件变更
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/mine/index.js` | 新建 |
| `miniprogram/pages/mine/index.wxml` | 新建 |
| `miniprogram/pages/mine/index.wxss` | 新建 |
| `miniprogram/pages/mine/index.json` | 新建 |

### 实现要点

**用户信息卡**：
- 头像 + 昵称 + ID
- 积分（点击跳转充值）

**4宫格快捷入口**：
- 充值（钱包图标，渐变蓝绿色）
- 签到（日历图标，渐粉红粉色）
- 会员（皇冠图标，渐变紫色）
- 邀请（用户添加图标，渐变绿色）

**功能列表**：
- 消息中心（带未读数角标）
- 设置
- 浏览记录
- 我的关注

**服务列表**：
- 意见反馈
- 联系客服

### 验证
- [ ] 用户数据正确显示
- [ ] 积分显示实时
- [ ] 消息未读数正确
- [ ] 各入口跳转正常

---

## Phase 10：二级页面 — 第一批（核心用户流程）

### 目标
完成5个核心二级页面。

### 文件变更

#### 编辑资料 (editProfile)
- 头像上传（wx.chooseImage + 云存储上传）
- 昵称输入（20字限制+计数）
- 性别选择（男/女两选一）
- 个性签名（100字限制+计数）
- 账号ID（锁定不可改+锁图标）
- 保存按钮

#### 搜索 (search)
- 搜索框 + 搜索按钮
- 搜索历史（chips + 清空）
- 热门搜索（排行列表，前3名特殊颜色）
- 搜索结果（瀑布流，空结果显示空状态）

#### 作品详情 (workDetail)
- 顶部图片（自己的草稿显示轮播，其他单图）
- 用户信息行（头像+昵称+关注按钮/管理按钮）
- 标题 + 描述
- 标签（模型/比例/风格/分类标签）
- 提示词卡片（可复制）
- 生成时间
- 互动数据（点赞/收藏/同款数，仅已发布显示）
- 底部操作栏：
  - 自己的作品：删除/下载/重新生成
  - 他人作品：点赞/收藏/一键同款

#### 设置 (settings)
- 账号区：编辑个人资料、手机号
- 外观区：深色模式开关（切换全局主题）
- 关于区：用户协议、隐私政策、充值协议、清除缓存、当前版本（管理员点击进入后台）
- 退出登录按钮

#### 意见反馈 (feedback)
- 反馈类型三选一（Bug反馈/体验反馈/优化建议）
- 描述输入（500字限制+计数）
- 截图上传（最多2张）
- 微信号输入（选填）
- 提交按钮（渐变色）

### 验证
- [ ] 编辑资料保存后数据库更新
- [ ] 搜索功能支持标题/提示词/标签匹配
- [ ] 作品详情显示完整，互动功能正常
- [ ] 深色模式切换全局生效
- [ ] 反馈提交成功

---

## Phase 11：二级页面 — 第二批（积分 & 会员体系）

### 目标
完成积分和会员相关的6个页面。

### 文件变更

#### 积分充值 (recharge)
- 顶部余额卡片（渐变色背景）
- 5个充值档位 + 自定义按钮（3列网格）
- 自定义充值弹窗（输入金额 → 计算积分+赠送 → 确认）
- 积分获得/消耗记录 Tab 切换

#### 每日签到 (checkin)
- 连续签到天数 + 签到按钮
- 里程碑奖励（4个：3天/7天/14天/30天）
- 月历（签到日标记、今日高亮、里程碑日礼物图标）

#### 会员中心 (membership)
- 会员卡（深色渐变背景，显示权益数据）
- 3个套餐卡片（月卡/季卡推荐/年卡）
- 开通按钮（价格随套餐切换）
- 会员权益4宫格（每日积分/签到加成/专属徽章/优先生成）

#### 邀请好友 (invite)
- 顶部邀请卡（渐变色）
- 邀请码卡片（复制+分享按钮）
- 已邀请列表（头像+昵称+日期+积分）
- 活动规则说明

#### 消息中心 (messages)
- 6类消息卡片（点赞/收藏/同款/新粉丝/系统/客服）
- 每个卡片显示图标+标题+最新消息摘要+未读数
- 点击跳转消息详情

#### 消息详情 (msgDetail)
- 消息列表（头像+内容+时间+未读标记）
- 进入页面自动标记已读
- 空状态处理

### 注意
- 支付接口预留：充值/会员开通按钮点击后 Toast 提示"支付功能即将上线"
- 签到和里程碑积分操作正常实现（通过云函数）

### 验证
- [ ] 充值档位选择正确
- [ ] 自定义充值计算正确
- [ ] 签到后积分增加，日历标记正确
- [ ] 里程碑可领取
- [ ] 会员套餐切换价格更新
- [ ] 消息分类和详情显示正确

---

## Phase 12：二级页面 — 第三批（社交 & 内容）

### 目标
完成社交和内容相关的9个页面。

### 文件变更

#### 发布作品 (publish)
- 选择草稿（底部弹窗选草稿图片）
- 标题输入（30字限制+计数）
- 描述输入（200字限制+计数）
- 标签选择（12个可选，最多5个，每个有独立配色）
- 发布按钮

#### 编辑作品 (editWork)
- 作品预览卡片
- 标题/描述/标签编辑（同发布）
- 保存按钮

#### 反推提示词 (reversePrompt)
- 上传区域（虚线边框+图标+文字）
- 上传后显示预览
- 分析按钮（消耗5积分）
- 分析结果（textarea + 复制/带入创作按钮）

#### 他人主页 (userProfile)
- 头像 + 昵称 + ID + 性别标签
- 签名
- 统计（作品/粉丝/获赞）+ 关注按钮
- 作品瀑布流

#### 关注/粉丝列表 (followList)
- Tab 或页面标题切换（关注/粉丝）
- 用户列表（头像+昵称+签名+关注按钮）
- 空状态处理

#### 浏览记录 (history)
- 按日期分组（今天/昨天）
- 3列网格显示
- 清空按钮

#### 举报 (report)
- 7个举报原因选择（单选高亮）
- 补充描述 textarea
- 提交按钮

#### 全部模型 (allModels)
- 4个模型列表卡片（封面+名称+描述+标签+积分）
- 当前选中高亮
- 点击切换并返回创作页

#### 全部玩法 (allGameplays)
- 3列网格展示8个玩法
- 点击跳转创作页套用模板

### 验证
- [ ] 发布流程完整（选草稿→填信息→发布）
- [ ] 反推分析后能带入创作页
- [ ] 关注/取消关注状态同步
- [ ] 举报提交成功
- [ ] 模型切换返回创作页参数更新

---

## Phase 13：管理后台（完整版）

### 目标
完成全部管理后台页面。

### 文件变更

管理后台作为分包加载（`pages/admin/`），入口在设置页"当前版本"行。

#### 管理首页 (admin/index)
- 数据概览4卡片（总用户/总作品/今日生成/今日收入）
- 内容管理列表入口（Banner/模型/风格/玩法/作品）
- 用户管理列表入口（举报队列/用户列表）
- 系统设置入口（积分规则/审核设置）

#### 数据统计（4个页面）
- `adminStatUsers`：新增/活跃/留存+柱状图+用户构成（普通/VIP/封禁）
- `adminStatWorks`：总量/已发布/未发布+风格分布+互动数据
- `adminStatGen`：生成量/成功率+模型分布+性能指标
- `adminStatRevenue`：今日/本月+收入构成+充值档位分析

统计图使用纯 CSS 柱状图（div 高度比例）。

#### 内容管理（4个列表+4个编辑）
- Banner 管理/编辑：图片+标题+链接+排序+日期范围+上下架
- 模型管理/编辑：封面+名称+描述+积分+标签+角标+启用开关
- 风格管理/编辑：3列网格+封面+名称+描述+排序+提示词后缀+启用开关
- 玩法管理/编辑：封面+名称+排序+默认提示词+推荐模型+启用开关

#### 作品管理
- `adminWorks`：筛选（全部/已发布/未发布）+搜索+列表
- `adminWorkDetail`：图片+信息+统计+操作（下架/推荐/删除/删除并封禁）

#### 举报管理
- `adminReports`：状态统计（待处理/已处理/已驳回）+筛选+列表
- `adminReportDetail`：举报图片+信息+处理操作（删除封禁/仅删除/驳回）

#### 用户管理
- `adminUsers`：搜索+列表（VIP/封禁状态标记）
- `adminUserDetail`：信息+操作（重置密码/清空作品/查看作品/封禁/解封）
- `adminUserWorks`：指定用户的作品列表

#### 系统设置
- `adminPoints`：积分规则列表（获取/消耗/里程碑），点击编辑
- `adminAudit`：自动审核开关（AI检测/敏感词/NSFW）+阈值配置+通知设置

### 权限控制
- 前端：设置页中 isAdmin 用户才显示管理后台入口
- 云函数：所有 admin.* action 校验 `users.isAdmin`

### 验证
- [ ] 数据概览显示聚合数据
- [ ] 所有 CRUD 操作正常
- [ ] 举报处理流程完整
- [ ] 非管理员无法访问管理功能

---

## Phase 14：交互细节 & 联调优化

### 目标
打磨交互体验，完成全流程联调。

### 交互打磨

**Tab 切换动画**：
- 根据 Tab 序号判断方向（左→右 or 右→左）
- 使用 CSS animation translateX

**二级页推入/推出**：
- navigateTo 时新页面从右侧滑入
- navigateBack 时当前页面向右滑出
- 使用 wx.navigateTo 默认动画

**Tab 指示器**：
- 切换时指示器平滑移动到新位置
- 使用 wx.createSelectorQuery 获取元素位置

**点赞心跳动画**：
- 点击时 icon scale(1.4) → scale(1)
- 同时切换填充色和线条色

**图片淡入**：
- 图片加载完成后 opacity 0→1
- 使用 image bindload 事件

**Toast**：
- 从顶部滑入，2秒后滑出消失
- 使用 wx.showToast 或自定义组件

### 联调
- [ ] 所有页面从 Mock 切换到云数据库真实数据
- [ ] AI 生图完整流程（kie.ai 提交→轮询→下载→上传云存储→入库）
- [ ] 积分全流程（充值→消费→退还→签到→里程碑）
- [ ] 图片上传（头像/反馈/创作参考图/Banner等）
- [ ] 内容安全检测接入（msgSecCheck/imgSecCheck）

### 性能优化
- [ ] 图片懒加载（lazy-load 属性）
- [ ] 瀑布流分页（每页10-20条）
- [ ] 数据库查询索引配置
- [ ] 管理后台分包加载
- [ ] 图片压缩上传

### 最终验证
- [ ] 全流程 E2E：注册→充值→创作→发布→互动→管理
- [ ] 所有动画流畅无错位
- [ ] 无控制台报错
- [ ] 页面加载速度可接受
