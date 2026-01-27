export default function handler(req, res) {
  const client_id = process.env.OAUTH_CLIENT_ID;
  const redirect_uri = `${process.env.URL}/api/callback`; // Vercel จะเติม URL ให้เอง
  const scope = "repo"; // ถ้า repo public ใช้ "public_repo" ก็ได้

  const state = Math.random().toString(36).slice(2);
  const authURL =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(client_id)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  res.statusCode = 302;
  res.setHeader("Location", authURL);
  res.end();
}
