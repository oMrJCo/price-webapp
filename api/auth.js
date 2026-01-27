// /api/auth.js
export default async function handler(req, res) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.OAUTH_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      res.status(500).send(
        `Missing env: ${!clientId ? "GITHUB_CLIENT_ID " : ""}${!redirectUri ? "OAUTH_REDIRECT_URI" : ""}`.trim()
      );
      return;
    }

    const { provider = "github", site_id = "", scope = "repo" } = req.query;

    // state เอาไว้กัน CSRF + ส่ง site_id กลับ
    const stateObj = {
      provider,
      site_id,
      t: Date.now(),
      r: Math.random().toString(36).slice(2),
    };
    const state = Buffer.from(JSON.stringify(stateObj)).toString("base64url");

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: String(scope || "repo"),
      state,
      allow_signup: "true",
    });

    // ส่งไป GitHub authorize
    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.writeHead(302, { Location: url });
    res.end();
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
}
