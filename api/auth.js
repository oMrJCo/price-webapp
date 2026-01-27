export default async function handler(req, res) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI; 
    // ตัวอย่าง: https://price-webapp.vercel.app/api/callback

    if (!clientId || !redirectUri) {
      res.status(500).send("Missing env: GITHUB_CLIENT_ID / GITHUB_REDIRECT_URI");
      return;
    }

    // Decap จะส่ง ?repo=... มาได้ แต่เราไม่ต้องใช้ก็ได้
    const scope = "repo";
    const state = Math.random().toString(36).slice(2);

    const authorizeUrl =
      "https://github.com/login/oauth/authorize" +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${encodeURIComponent(state)}`;

    res.setHeader(
      "Set-Cookie",
      `decap_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure`
    );

    res.writeHead(302, { Location: authorizeUrl });
    res.end();
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
}
