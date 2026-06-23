# TEST_REPORT.md

## 测试范围

- TypeScript 类型检查。
- Next.js 生产构建与静态导出。
- CSV、TSV、JSON、HTML 表格转换逻辑。
- 移动端与桌面端布局检查。

## 当前结果

- `npm install`：通过。
- `npm run build`：通过，完成 Next.js 生产构建和静态导出。
- 浏览器桌面端验证：通过，示例 CSV 可生成可编辑 HTML table。
- 双击单元格编辑：通过，修改后结果实时更新。
- 数据清洗按钮：通过，移除空格、转大写验证成功。
- 数据转置：通过，转置后 Markdown 输出正确更新。
- 浏览器移动端验证：通过，390px 宽度下无横向溢出，输入区可见。
- 浏览器控制台：无 error 日志。

## 风险

- 浏览器剪贴板 API 在非 HTTPS 环境下可能受限制。
- HTML 表格解析依赖浏览器 DOMParser，不适用于服务端环境。
