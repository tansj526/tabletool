# DEPLOY.md

## 依赖安装

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

## 生产构建

```bash
npm run build
```

## Cloudflare Pages

Cloudflare Pages 设置：

- Framework preset：Vite
- Build command：`npm run build`
- Build output directory：`dist`

`wrangler.toml`：

```toml
compatibility_date = "2026-01-01"
```
