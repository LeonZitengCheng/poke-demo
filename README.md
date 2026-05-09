# Poke 戳戳 — Demo

一只小水獭，在你无意识刷手机时跳出来问你：**"你刚才在找什么？"**

![demo gif placeholder](./docs/demo.gif)

## 这个 demo 想验证什么

1. 打断动作本身是否有效——水獭出现的时机和方式，是打断还是烦扰？
2. "你在找什么" 这个问题，能不能让用户真的停下来想一秒？
3. 用户对三种回应路径（有目标 / 说不清楚 / 继续刷）的自然选择比例。

不验证：通知权限、系统级覆盖浮窗、真实的使用时长统计。

## 本地运行

```bash
npm install
npm run dev
# 打开 http://localhost:5173/poke-demo/
```

用右上角 ⚙️ 调试面板可以：
- 强制切换水獭情绪
- 立即触发戳戳（不用等 30 秒 / 5 张卡片）
- 重置计时器

## 部署到 GitHub Pages

1. 在 `package.json` 的 `homepage` 字段填入你的地址：
   ```json
   "homepage": "https://你的用户名.github.io/poke-demo"
   ```
2. 运行：
   ```bash
   npm run deploy
   ```
3. 访问 `https://你的用户名.github.io/poke-demo/`

> 首次部署需要在 GitHub 仓库 Settings → Pages 里把 source 设为 `gh-pages` 分支。

## 已知限制

- 这是 Web demo，不是真实的 Android 悬浮窗产品
- 触发条件（30 秒 / 5 张卡片）在演示时用调试面板手动触发更方便
- 短视频 Feed 是静态假数据，没有真实内容
- 没有数据上报，反馈收集需要另外安排
