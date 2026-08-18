export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    if (url.pathname.startsWith("/roco")) {
      if (method == "GET") {
        const code = url.searchParams.get("code");
        if (code != null) {
          let response = await fetch("https://gitee.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "grant_type": "authorization_code",
              "code": code,
              "client_id": env.id,
              "client_secret": env.secret,
              "redirect_uri": env.redirect
            })
          });
          let token = await response.json();
          if (token.error) {
            return new Response("code无效！", { status: 400, headers: { "Content-Type": "text/html;charset=utf-8" } });
          }
          const accessToken = token["access_token"];
          const cookie = `accessToken=${accessToken}; Domain=.errorawa.dpdns.org; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age==3600;`;
          return new Response(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>登录成功</title>
                <style>
                  html, body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    background-color: #525252;
                  }
                  .box {
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    padding: 30px;
                    background-color: #fff8e6;
                    border-radius: 20px;
                  }
                  .box div {
                    font-size: 17px;
                  }
                </style>
              </head>
              <body>
                <div class="box">
                  <div>登录成功，现在可以关闭该页面了</div>
                </div>
              </body>
            </html>
            `, {
              status: 200,
              headers: {
                "Content-Type": "text/html;charset=utf-8",
                "Set-Cookie": cookie
              }
            });
        } else {
          return new Response("", { status: 404 });
        }
      }
      if (method == "OPTIONS") {
        return new Response("", { status: 204 });
      }
      if (method == "POST" || method == "DELETE") {
        const cookie = request.headers.get("Cookie") || "";
        if (!cookie) {
          return new Response("", { status: 404 });
        }
        const token = cookie.match(/accessToken=([^;]+)/) || "";
        if (!token) {
          return new Response("", { status: 404 });
        }
        if (method == "POST") {
          return new Response(token[1], { status: 200 });
        } else {
          const clearCookie = `accessToken=; Domain=.errorawa.dpdns.org; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax;`;
          return new Response("", {
            status: 200,
            headers: {
              "Set-Cookie": clearCookie
            }
          });
        }
      }
    } else {
      return new Response("", { status: 404 });
    }
  }
}