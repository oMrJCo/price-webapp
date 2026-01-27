// /api/callback.js
export default async function handler(req, res) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.status(500).send(
        `Missing env: ${!clientId ? "GITHUB_CLIENT_ID " : ""}${!clientSecret ? "GITHUB_CLIENT_SECRET" : ""}`.trim()
      );
      return;
    }

    const code = req.query.code;
    const state = req.query.state;

    if (!code) {
      res.status(400).send("Missing ?code");
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
    const accessToken = tokenJson.access_token;

    if (!accessToken) {
      res.status(500).send(`Token exchange failed: ${JSON.stringify(tokenJson)}`);
      return;
    }

    // ดึง stateObj กลับมา (optional)
    let stateObj = {};
    try {
      if (state) {
        const raw = Buffer.from(String(state), "base64url").toString("utf8");
        stateObj = JSON.parse(raw);
      }
    } catch (_) {}

    // Decap CMS ต้องการส่ง token กลับไปที่ window.opener ด้วย postMessage
    // (เหมือน netlify-cms-oauth-provider)
    const payload = {
      token: accessToken,
      provider: stateObj.provider || "github",
    };

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Auth Callback</title>
  </head>
  <body>
    <script>
      (function () {
        var payload = ${JSON.stringify(payload)};
        // Decap CMS ฟัง event นี้
        var msg = 'authorization:' + payload.provider + ':success:' + JSON.stringify({ token: payload.token, provider: payload.provider });
        if (window.opener) {
          window.opener.postMessage(msg, '*');
          window.close();
        } else {
          document.body.innerText = 'No opener window. You can close this tab.';
        }
      })();
    </script>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
}
