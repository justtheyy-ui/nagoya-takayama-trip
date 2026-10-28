# 名古屋 × 高山冬季旅行

2027 年 1 月 6–13 日双人旅行仪表盘。静态网页由 GitHub Pages 托管。

## 当前状态

网页由 GitHub Pages 托管，共同编辑连接 Supabase 云数据库。首次保存需要共享编辑口令，其他访客可浏览。网站每 7 秒读取更新。

## 数据同步

`config.json` 仅保存 Supabase 项目 URL 与公开客户端 key，禁止填写 service_role 或 secret key。使用数据库 RPC 验证编辑口令，口令不得写入仓库。

`src/` 为 React 源码，`assets/` 为已打包网页资源。旅行票价和班次保留待核状态。
