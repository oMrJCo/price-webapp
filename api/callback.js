export default async function handler(req, res) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.status(500).send("Missing env: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET");
      return;
    }

    const { code, state } = req.query || {};
    if (!code) {
      res.status(400).send("Missing ?code");
      return;
    }

    // ตรวจ state (กันปลอม)
    const cookie = req.headers.cookie || "";
    const m = cookie.match(/decap_oauth_state=([^;]+)/);
    const savedState = m ? m[1] : "";
    if (!state || !savedState || state !== savedState) {
      res.status(400).send("Invalid state");
      return;
    }

    // แลก code -> access_token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenJson = await tokenRes.json();
    const token = tokenJson.access_token;

    if (!token) {
      res.status(400).send("No access_token returned from GitHub");
      return;
    }

    // ส่ง token กลับไปให้ Decap ผ่าน postMessage
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script>
      (function () {
        const token = ${JSON.stringify(token)};
        if (window.opener) {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify({ token: token }),
            '*'
          );
          window.close();
        } else {
          document.body.innerText = "Login success. You can close this tab.";
        }
      })();
    </script>
  </body>
</html>`);
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
}
