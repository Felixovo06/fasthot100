# FAST/HOT·100 — 考前 5 小时冲刺

LeetCode **热题 100** 全量速记卡片，专为考前/面试前的最后冲刺设计。
纯静态页面，无需后端，进度自动保存在浏览器本地。

## 玩法

- **主动回忆**：看到题面先在脑内复述套路、关键步骤、复杂度，再翻面对答案。
- **三档分流**：秒会 → 永久移出；模糊 / 不会 → 进重刷队列循环，直到全部秒会。
- **卡点止损**：圆环是单题建议用时（S 4min · A 2.5min · B 1min），超时翻面背思路，不硬磕。

快捷键：`空格` 翻面 · `1` 秒会 · `2` 模糊 · `3` 不会 · `Esc` 返回总览。

## 多人使用

页面是纯静态的，**每个人的刷题进度（自评 + 计时）各自存在自己浏览器的 `localStorage` 里**，
互不干扰。把 GitHub Pages 链接发给朋友，各刷各的即可，无需账号系统。

> 注意：进度按「浏览器 + 设备」隔离。换设备 / 清缓存 / 无痕模式会从零开始。

## 本地运行

双击 `启动.command`（macOS），或在项目根目录执行：

```bash
python3 -m http.server 8100
# 浏览器打开 http://localhost:8100
```

## 部署到 GitHub Pages

推到 GitHub 后，在仓库 **Settings → Pages → Build and deployment** 选
`Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存即可。
访问地址形如 `https://<用户名>.github.io/<仓库名>/`。

## 项目结构

```
index.html        页面骨架
style.css         样式
app.js            交互逻辑（计时、队列、自评、本地存储）
data/data1-5.js   100 题速记卡（套路 / 思路 / 易错点 / 复杂度 / Java 题解）
data/full.js      力扣官方完整题面（抓取自 leetcode.cn）
scripts/          题面抓取脚本（fetch_full.mjs 全量 / fetch_missing.mjs 增量）
```

## 数据维护

新增题目后重新抓取完整题面：

```bash
node scripts/fetch_full.mjs      # 重抓全部 100 题，重写 data/full.js
node scripts/fetch_missing.mjs   # 仅抓增量题，合并进现有 data/full.js
```
