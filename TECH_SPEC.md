# TECH_SPEC.md

## 项目结构

```text
src/
├── pages/
│   ├── Home
│   ├── Tool
│   └── About
├── components/
│   ├── ui
│   ├── common
│   └── layout
├── hooks/
├── services/
├── stores/
├── locales/
├── types/
├── utils/
└── router/
```

## 技术方案

- 使用 Vite 构建 React 19 应用。
- 使用 TypeScript strict 模式。
- 使用 TailwindCSS 实现响应式页面。
- 使用 Zustand 保存工具输入、输出和格式选择。
- 使用 React Hook Form 与 Zod 处理表单校验。
- 使用 i18next 提供六语言文案。

## API 设计

本项目为纯前端工具，无后端接口。内部服务统一返回：

```typescript
{
  success: boolean;
  data: T | null;
  message: string;
}
```

## 数据流设计

1. 用户在表单中选择输入格式、输出格式并输入文本。
2. Zod 校验输入内容。
3. `convertTableData` 解析为二维表格数据并保存到 Zustand。
4. 页面将二维数组渲染为 HTML table。
5. 用户双击 table cell 后修改 Zustand 中的单元格。
6. 清洗按钮调用表格操作函数更新二维数组。
7. 根据输出格式实时序列化结果。

## 部署设计

- 构建命令：`npm run build`
- 输出目录：`dist`
- Cloudflare Pages 配置见 `wrangler.toml`。
