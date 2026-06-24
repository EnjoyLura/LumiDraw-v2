# 露米画板 - AI 辅助开发指引

## 项目概述

**产品名**：露米画板（Lumi-Draw）  
**类型**：微信小程序（云开发）  
**功能**：AI 绘画创作平台，支持多模型文生图、作品社区、积分会员体系  
**原型图**：`prototype/mobile-prototype.html`（3018行，所有 UI 和交互的唯一参考源）

## 技术栈

- **前端**：微信小程序原生（WXML + WXSS + JS）
- **后端**：微信云开发（云函数 + 云数据库 + 云存储）
- **AI 接口**：kie.ai 平台（异步任务模式）
- **云环境 ID**：`cloud1-d9g2e4d5cedc3365`
- **AppID**：`wxb0923fd574195098`

## 项目约定

### 编码规范
- 使用 2 空格缩进
- 变量命名：camelCase
- 常量命名：UPPER_SNAKE_CASE
- 文件名：camelCase（页面文件夹）或 kebab-case（组件文件夹）
- 注释使用中文

### 目录结构
```
miniprogram/
├── app.js / app.json / app.wxss   # 全局入口
├── config.js                       # 全局配置常量
├── utils/                          # 工具函数
│   ├── api.js                      # 云函数调用封装
│   ├── util.js                     # 通用工具
│   ├── auth.js                     # 用户鉴权
│   └── config.js                   # 常量定义
├── components/                     # 通用组件
├── pages/                          # 页面（每个页面一个文件夹）
│   ├── home/                       # 一级页面 - 首页
│   ├── plaza/                      # 一级页面 - 广场
│   ├── create/                     # 一级页面 - 创作
│   ├── gallery/                    # 一级页面 - 画廊
│   ├── mine/                       # 一级页面 - 我的
│   └── ...                         # 二级页面
└── images/                         # 静态图片资源

cloudfunctions/
└── main/                           # 单入口云函数
    ├── index.js                    # 主入口，event.action 路由
    ├── package.json
    └── config.json
```

### 云函数架构
- 采用**单入口路由模式**：一个 `main` 云函数，通过 `event.action` 分发到不同处理逻辑
- action 命名规范：`模块.操作`，如 `user.login`、`ai.generateImage`、`work.getList`
- 所有云函数调用通过 `utils/api.js` 统一封装

### 页面开发流程
1. 参考原型图对应页面的 HTML 结构和交互逻辑
2. 在 `app.json` 中注册页面路由
3. 创建页面文件夹（index.js / index.wxml / index.wxss / index.json）
4. 实现页面逻辑和模板
5. 通过云函数获取真实数据（开发阶段可用 Mock 数据过渡）
6. 验证与原型图的还原度

### 数据获取模式
- 页面 onLoad/onShow 中调用 `api.call('xxx.yyy', params)` 获取数据
- 数据缓存在页面 data 中
- 列表类数据使用分页加载（page/pageSize）

### 状态管理
- 全局状态：`app.globalData`（用户信息、登录态、主题）
- 页面状态：页面 data
- 跨页面通信：`getApp().globalData` 或 `eventChannel`

## AI 模型配置

| 模型名 | API 模型 ID | 积分消耗 | 特点 |
|--------|------------|---------|------|
| Nano Banana 2 | nano-banana-2 | 8 | 速度极快·性价比高 |
| GPT Image 2 | gpt-image-2 | 15 | 画质细腻·理解力强 |
| Nano Banana Pro | nano-banana-pro | 12 | 进阶版本·质量更高 |
| Seedream 4.5 | seedream-4.5 | 10 | 高保真·4K支持 |

## 关键注意事项

1. **原型图是唯一 UI 参考源**：所有页面的布局、交互、动画均以 `prototype/mobile-prototype.html` 为准
2. **产品名**：原型图中的"绘光"统一替换为"露米画板"
3. **支付**：UI 正常实现，支付接口预留，实际支付暂返回模拟成功
4. **内容安全**：发布内容需接入微信 msgSecCheck/imgSecCheck
5. **管理后台入口**：隐藏入口在设置页"当前版本"行，仅 isAdmin 用户可见
6. **个人主体限制**：当前为个人主体，部分微信 API 受限，后续迁移到个体工商户
