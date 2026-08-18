# 洛克图鉴 OAuth API

用于洛克图鉴的 Gitee OAuth 登录 Cloudflare Worker。

## 部署

> 部署前，请先前往 [Gitee 创建第三方应用](https://gitee.com/oauth/applications) 注册一个 OAuth 应用，权限只需勾选 **projects**。

### 一键部署

1. 点击下方按钮一键部署：

   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ERRORawa/rocoOAuthAPI)

2. 在 Cloudflare 控制台的 Worker **设置 → 变量** 中配置以下变量：

   | 变量 | 说明 |
   | --- | --- |
   | `id` | 在 Gitee 创建的第三方应用中给出的 `client_id` |
   | `secret` | 在 Gitee 创建的第三方应用中给出的 `client_secret` |
   | `redirect` | 当前部署的 Worker 的地址 |

## 工作原理

- `GET /roco?code=<code>` — 用 Gitee 授权码换取 access token，并设置 `accessToken` Cookie。
- `POST /roco` — 从 Cookie 中返回 access token。
- `DELETE /roco` — 清除 Cookie。