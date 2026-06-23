# tabletool

专业的表格数据转换小工具网站。输入数据后会生成可编辑 HTML table，支持双击修改单元格、清洗表格数据，并导出为 JSON、CSV、Excel、SQL、HTML、Markdown、TSV、XML、YAML 以及多种代码、文档和数据交换格式。

## 技术栈

- React 19
- TypeScript
- Next.js
- TailwindCSS
- Zustand
- React Hook Form
- Zod
- i18next

## 安装依赖

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 当前工具功能

- 输入数据并生成可编辑 HTML table。
- 双击单元格修改内容。
- 清空、移除空行、移除空列、移除空格。
- 转大写、转小写、数据转置。
- 复制或下载转换结果。
- 从 `blog/{locale}` 读取 Markdown 文件并生成多语言博客页面。

## Cloudflare Pages 部署

- 构建命令：`npm run build`
- 输出目录：`out`
- 兼容日期：`2026-01-01`

## 博客内容

博客 Markdown 放在：

```text
blog/{locale}/{slug}.md
```

示例：

```text
blog/zh/test-post.md
blog/en/test-post.md
```
