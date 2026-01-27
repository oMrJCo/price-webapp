export default async function handler(req, res) {
  const code = req.query.code;
  const state = req.query.state || "";
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) return res.status(400).send("Missing code");
  if (!client_id || !client_secret) {
    return res.status(500).send("Missing env: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET");
  }

  // แลก code -> access_token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ client_id, client_secret, code }),
  });

  const tokenJson = await tokenRes.json();
  const token = tokenJson.access_token;

  if (!token) {
    return res.status(500).send("No access_token from GitHub: " + JSON.stringify(tokenJson));
  }

  // ส่ง token กลับไปให้ Decap (postMessage ไปหน้า opener)
  // provider ต้องตรงกับ backend.name = github
  const content = `<!doctype html>
<html>
  <body>
    <script>
      (function() {
        function send() {
          var msg = 'authorization:github:success:' + JSON.stringify({ token: ${JSON.stringify(token)} });
          if (window.opener) {
            window.opener.postMessage(msg, '*');
            window.close();
          } else {
            document.body.innerText = 'No opener window. You can close this tab.';
          }
        }
        send();
      })();
    </script>
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(content);
}
