// /api/health.js
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    hasClientId: !!process.env.GITHUB_CLIENT_ID,
    hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    hasRedirect: !!process.env.OAUTH_REDIRECT_URI,
  });
}
