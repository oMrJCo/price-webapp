export default function handler(req, res) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = process.env.OAUTH_REDIRECT_URI; // เช่น https://price-webapp.vercel.app/api/callback
  const scope = process.env.OAUTH_SCOPE || "repo";

  if (!client_id || !redirect_uri) {
    res.status(500).send("Missing env: GITHUB_CLIENT_ID or OAUTH_REDIRECT_URI");
    return;
  }

  // Decap จะส่ง ?site_id=... มาให้เรา (เราเก็บไว้ใน state)
  const site_id = req.query.site_id || "";
  const state = Buffer.from(JSON.stringify({ site_id })).toString("base64");

  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(client_id)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  res.writeHead(302, { Location: url });
  res.end();
}
