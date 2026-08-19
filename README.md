# 洛克图鉴 OAuth API

用于[洛克图鉴](https://github.com/ERRORawa/RocoHandbook)的 Gitee OAuth 登录 Cloudflare Worker。

## 部署

> 部署前，请先前往 [Gitee 创建第三方应用](https://gitee.com/oauth/applications) 注册一个 OAuth 应用，权限只需勾选 **projects**。

### 一键部署

1. 点击下方按钮一键部署：

   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ERRORawa/RocoOAuthAPI)

2. 在 Cloudflare 控制台的 Worker **设置 → 变量** 中配置以下变量：

   | 变量 | 说明 |
   | --- | --- |
   | `id` | 在 Gitee 创建的第三方应用中给出的 `client_id` |
   | `secret` | 在 Gitee 创建的第三方应用中给出的 `client_secret` |
   | `redirect` | 在 Gitee 创建的第三方应用中填写的 `client_secret`，通常为当前worker的链接 |

## 后续工作

1. 修改前端的`window.open("https://gitee.com/oauth/…`，将其中的client_id和redirect_uri替换为你的第三方应用中的内容，其中redirect_uri需要编码为URIComponent

2. 为你的域名设置响应头转换规则，传入请求匹配设置为

   | 字段 | 运算符 | 值 |
   | --- | --- | ---
   | 主机名 | 包含 | api |

响应头内容为

   | | 标头名称 | 值 |
   | --- | --- | --- |
   | 设置静态 | Access-Control-Allow-Credentials | true |
   | 设置静态 | Access-Control-Allow-Methods | GET,HEAD,POST,OPTIONS,DELETE |
   | 设置静态 | Access-Control-Allow-Origin | `这里设置为你的前端链接` |

## 工作原理

- `GET /roco?code=<code>` — 用 Gitee 授权码换取 access token，并设置 `accessToken` Cookie。
- `POST /roco` — 从 Cookie 中返回 access token。
- `DELETE /roco` — 清除 Cookie。
