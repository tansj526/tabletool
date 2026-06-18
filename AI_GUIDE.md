# AI_GUIDE.md

# 专业的表格数据转换工具

tabletool

------

# 项目目标

开发一个独立部署的小工具网站。

目标用户：

- 普通互联网用户
- SEO流量用户
- 社交媒体分享用户

核心要求：

- 页面加载速度快
- 支持移动端
- SEO友好
- 支持多语言
- 可部署到 Cloudflare Pages
- 后期可快速扩展更多工具

------

# 技术栈

## 前端

- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui

## 状态管理

- Zustand

## 表单

- React Hook Form
- Zod

## 国际化

- i18next

支持：

- 英文
- 中文
- 日文
- 德文
- 法文
- 西班牙文

------

# 目录结构

```text
src/

├── pages/
│   ├── Home
│   ├── Tool
│   └── About
│
├── components/
│   ├── ui
│   ├── common
│   └── layout
│
├── hooks/
│
├── services/
│
├── stores/
│
├── locales/
│
├── types/
│
├── utils/
│
└── router/
```

------

# UI设计规范

## 页面布局

顶部：

- Logo
- 导航菜单
- 语言切换

主体：

- Tool Hero
- Tool Form
- Result Area

底部：

- Copyright
- Privacy Policy
- Terms

------

## 颜色规范

主色：

```css
#2563EB
```

成功：

```css
#16A34A
```

警告：

```css
#F59E0B
```

错误：

```css
#DC2626
```

------

## 响应式

必须支持：

- Mobile
- Tablet
- Desktop

断点：

```text
sm 640px
md 768px
lg 1024px
xl 1280px
```

------

# SEO规范

每个页面必须生成：

```html
<title></title>

<meta
  name="description"
/>

<meta
  name="keywords"
/>
```

Open Graph：

```html
<meta property="og:title" />
<meta property="og:description" />
<meta property="og:image" />
```

JSON-LD：

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication"
}
```

------

# Tool页面标准结构

## Hero区域

包含：

- 工具名称
- 工具简介
- CTA按钮

------

## 输入区域

包含：

- 表单
- 参数说明
- 示例

------

## 输出区域

包含：

- 结果展示
- 复制按钮
- 下载按钮

------

## FAQ区域

至少5个FAQ

格式：

```json
{
  "@type": "Question",
  "name": "",
  "acceptedAnswer": {}
}
```

------

# 代码规范

## TypeScript

禁止：

```typescript
any
```

优先：

```typescript
interface
type
```

------

## React

优先：

```typescript
Function Component
Hooks
```

禁止：

```typescript
Class Component
```

------

## 命名规范

组件：

```text
PascalCase
```

变量：

```text
camelCase
```

常量：

```text
UPPER_CASE
```

------

# AI生成代码要求

每次生成代码时必须：

1. 提供完整代码
2. 提供文件路径
3. 提供依赖安装命令
4. 提供运行命令
5. 提供部署命令

禁止：

- 只返回代码片段
- 省略关键逻辑
- 使用伪代码

------

# 错误处理

所有接口必须：

```typescript
try {
}
catch {
}
```

统一返回：

```typescript
{
  success:boolean,
  data:any,
  message:string
}
```

------

# 国际化规范

文案禁止硬编码：

错误：

```tsx
<Button>
  Submit
</Button>
```

正确：

```tsx
<Button>
  {t("submit")}
</Button>
```

------

# 性能优化

必须实现：

- 懒加载
- 路由拆分
- 图片压缩
- CDN缓存

目标：

```text
Lighthouse > 90
```

------

# Cloudflare部署规范

构建命令：

```bash
npm run build
```

输出目录：

```text
dist
```

配置：

```toml
compatibility_date = "2026-01-01"
```

------

# Git规范

提交格式：

```bash
feat:
fix:
refactor:
docs:
style:
chore:
```

示例：

```bash
git commit -m "feat: add qr code generator"
```

------

# 开发流程

Step1

需求分析

输出：

```text
PRD.md
```

------

Step2

页面设计

输出：

```text
UI_SPEC.md
```

------

Step3

技术设计

输出：

```text
TECH_SPEC.md
```

------

Step4

代码生成

输出：

```text
src/*
```

------

Step5

测试

输出：

```text
TEST_REPORT.md
```

------

Step6

部署

输出：

```text
DEPLOY.md
```

------

# AI执行原则

当AI开始开发时：

先输出：

1. 项目结构
2. 技术方案
3. 页面结构
4. API设计
5. 数据流设计

确认后再开始编码。

每个阶段结束时：

输出：

```text
当前完成内容
剩余任务
下一步计划
```

禁止直接跳过设计阶段开始写代码。

------

# 最终交付物

必须包含：

```text
README.md
AI_GUIDE.md
PRD.md
UI_SPEC.md
TECH_SPEC.md
DEPLOY.md
TEST_REPORT.md
```

以及：

```text
完整可运行源码
```