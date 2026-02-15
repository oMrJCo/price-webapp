document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");

  const CATEGORIES_URL =
    "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";

  // base สำหรับ GitHub Pages (เพื่อทำ relative path ให้ชัวร์)
  const GH_BASE = "/";

  function buildPriceSheetUrlFromTab(tabName) {
    // ใช้ relative จะได้ทำงานทั้งบน GH Pages และกรณีมี custom domain ในอนาคต
    return `${GH_BASE}price_sheet.html?tab=${encodeURIComponent(tabName)}`;
  }

  function isLikelyHttpUrl(url) {
    return typeof url === "string" && /^https?:\/\//i.test(url.trim());
  }

  function normalizeMaybeRelativeUrl(url) {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";
  // absolute URLs remain untouched
  if (/^https?:\/\//i.test(u)) return u;
  // make relative + remove legacy base
  return u.replace(/^\/price-webapp\//, "").replace(/^\/+/, "");
});
