/*
 * LEEPLUS Price Web - Usage Analytics
 * File: analytics.js
 * Baseline: v1.2.3
 *
 * Goals
 * - Lightweight: never blocks initial page rendering.
 * - Privacy-minded: no name, phone, dealer code, or full query string is collected.
 * - Safe rollout: failures are silent and never affect the price web.
 *
 * Backend contract (next step)
 * POST JSON to ANALYTICS_ENDPOINT:
 * {
 *   action: "analyticsTrack",
 *   event: "...",
 *   ts: "...",
 *   visitorId: "...",
 *   sessionId: "...",
 *   audience: "RETAIL|DEALER",
 *   page: "...",
 *   referrer: "...",
 *   data: {...}
 * }
 */

(() => {
  "use strict";

  const ANALYTICS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxqUpwXOo05dZ1iv9BP29pVR273Qj1d8fXwYZnn29A9cpNfrAtE0IKL7uqO-DXopIgUYA/exec";

  const STORAGE_VISITOR = "lp_analytics_visitor_v1";
  const STORAGE_SESSION = "lp_analytics_session_v1";
  const SESSION_TOUCH = "lp_analytics_session_touch_v1";
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const MAX_DATA_LENGTH = 300;

  // Geo-IP: province/region only. No IP address is stored or sent to our backend.
  const GEO_ENDPOINT = "https://ipwho.is/";
  const GEO_CACHE_KEY = "lp_analytics_geo_v1";
  const GEO_CACHE_MS = 7 * 24 * 60 * 60 * 1000;
  const GEO_FAIL_CACHE_MS = 6 * 60 * 60 * 1000;
  const GEO_TIMEOUT_MS = 2500;

  function nowIso() {
    return new Date().toISOString();
  }

  function randomId(prefix) {
    try {
      if (crypto && typeof crypto.randomUUID === "function") {
        return `${prefix}_${crypto.randomUUID()}`;
      }
    } catch (_) {}
    return `${prefix}_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 11)}`;
  }

  function safeLocalGet(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch (_) {
      return "";
    }
  }

  function safeLocalSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  function safeSessionGet(key) {
    try {
      return sessionStorage.getItem(key) || "";
    } catch (_) {
      return "";
    }
  }

  function safeSessionSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (_) {}
  }


  function readGeoCache() {
    try {
      const raw = safeLocalGet(GEO_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || Number(parsed.expiresAt || 0) <= Date.now()) return null;
      return {
        province: cleanValue(parsed.province || "").slice(0, 80),
        country: cleanValue(parsed.country || "").slice(0, 8),
      };
    } catch (_) {
      return null;
    }
  }

  function writeGeoCache(province, country, ttlMs) {
    try {
      safeLocalSet(
        GEO_CACHE_KEY,
        JSON.stringify({
          province: cleanValue(province || "").slice(0, 80),
          country: cleanValue(country || "").slice(0, 8),
          expiresAt: Date.now() + ttlMs,
        })
      );
    } catch (_) {}
  }

  async function fetchGeo() {
    const cached = readGeoCache();
    if (cached) return cached;

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller
      ? setTimeout(() => controller.abort(), GEO_TIMEOUT_MS)
      : null;

    try {
      const response = await fetch(GEO_ENDPOINT, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        signal: controller ? controller.signal : undefined,
      });
      if (!response.ok) throw new Error("geo_http_" + response.status);

      const geo = await response.json();
      if (geo && geo.success === false) throw new Error("geo_failed");

      const province = cleanValue(geo?.region || "").slice(0, 80);
      const country = cleanValue(geo?.country_code || "").slice(0, 8);

      // Keep only province/region + country code locally. Never persist the public IP.
      writeGeoCache(province, country, GEO_CACHE_MS);
      return { province, country };
    } catch (_) {
      // Short failure cache prevents repeated calls if the provider is unavailable.
      writeGeoCache("", "", GEO_FAIL_CACHE_MS);
      return { province: "", country: "" };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  let geoState = readGeoCache() || { province: "", country: "" };
  let geoPromise = null;

  function ensureGeo() {
    const cached = readGeoCache();
    if (cached) {
      geoState = cached;
      return Promise.resolve(cached);
    }
    if (!geoPromise) {
      geoPromise = fetchGeo()
        .then((geo) => {
          geoState = geo || { province: "", country: "" };
          return geoState;
        })
        .finally(() => {
          geoPromise = null;
        });
    }
    return geoPromise;
  }

  function getVisitorId() {
    let id = safeLocalGet(STORAGE_VISITOR);
    if (!id) {
      id = randomId("v");
      safeLocalSet(STORAGE_VISITOR, id);
    }
    return id;
  }

  function getSessionId() {
    const now = Date.now();
    const lastTouch = Number(safeSessionGet(SESSION_TOUCH) || 0);
    let id = safeSessionGet(STORAGE_SESSION);

    if (!id || !lastTouch || now - lastTouch > SESSION_TIMEOUT_MS) {
      id = randomId("s");
      safeSessionSet(STORAGE_SESSION, id);
    }

    safeSessionSet(SESSION_TOUCH, String(now));
    return id;
  }

  function getAudience() {
    return location.pathname.startsWith("/dealer/") ? "DEALER" : "RETAIL";
  }

  function getPageName() {
    const path = location.pathname || "/";
    if (/price_sheet\.html$/i.test(path)) return "PRICE_SHEET";
    if (path.startsWith("/dealer/")) return "DEALER";
    if (path === "/" || /index\.html$/i.test(path)) return "HOME";
    return path.slice(0, 80);
  }

  function getSafeReferrer() {
    try {
      if (!document.referrer) return "";
      const u = new URL(document.referrer);
      return `${u.origin}${u.pathname}`.slice(0, 180);
    } catch (_) {
      return "";
    }
  }

  function cleanValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "number" || typeof value === "boolean") return value;
    return String(value).replace(/\s+/g, " ").trim().slice(0, MAX_DATA_LENGTH);
  }

  function cleanData(data) {
    const out = {};
    if (!data || typeof data !== "object") return out;

    Object.keys(data).slice(0, 12).forEach((key) => {
      // Explicitly exclude sensitive/auth-like fields.
      if (/code|password|token|phone|email|name/i.test(key)) return;
      out[String(key).slice(0, 40)] = cleanValue(data[key]);
    });
    return out;
  }

  function buildPayload(event, data) {
    return {
      action: "analyticsTrack",
      event: cleanValue(event).slice(0, 60),
      ts: nowIso(),
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      audience: getAudience(),
      page: getPageName(),
      referrer: getSafeReferrer(),
      province: cleanValue(geoState.province || "").slice(0, 80),
      data: cleanData(data),
    };
  }

  function sendPayload(payload) {
    try {
      const body = JSON.stringify(payload);

      // Beacon is preferred because it is non-blocking and survives navigation.
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
        if (navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)) return;
      }

      // Fire-and-forget fallback. Never await this request.
      fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        cache: "no-store",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
      }).catch(() => {});
    } catch (_) {}
  }

  function track(event, data = {}) {
    // Push tracking outside the critical rendering path.
    const run = () => {
      try {
        sendPayload(buildPayload(event, data));
      } catch (_) {}
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1500 });
    } else {
      setTimeout(run, 0);
    }
  }

  function currentTab() {
    try {
      return new URL(location.href).searchParams.get("tab") || "";
    } catch (_) {
      return "";
    }
  }

  function trackInitialView() {
    const page = getPageName();

    if (page === "PRICE_SHEET") {
      track("price_sheet_view", { tab: currentTab() });
    } else if (page === "DEALER") {
      track("dealer_home_view");
    } else if (page === "HOME") {
      track("home_view");
    } else {
      track("page_view", { path: location.pathname });
    }
  }

  function closestLink(target) {
    if (!(target instanceof Element)) return null;
    return target.closest("a,button");
  }

  function extractCategory(el) {
    if (!el) return "";
    const label =
      el.querySelector?.(".title-en")?.textContent ||
      el.querySelector?.(".title-th")?.textContent ||
      el.getAttribute?.("data-category") ||
      "";
    return cleanValue(label);
  }

  function installClickTracking() {
    document.addEventListener(
      "click",
      (event) => {
        const el = closestLink(event.target);
        if (!el) return;

        const href = el.getAttribute?.("href") || "";
        const text = cleanValue(el.textContent || "");

        if (el.classList?.contains("card")) {
          track("category_click", {
            category: extractCategory(el),
            destination: href.split("?")[0],
          });
          return;
        }

        if (el.id === "openPdfBtn" || /\.pdf(?:$|\?)/i.test(href)) {
          track("pdf_click", { tab: currentTab() });
          return;
        }

        if (/line\.me/i.test(href) || /LINE/i.test(text)) {
          track("contact_click", { channel: "LINE" });
          return;
        }

        if (/facebook\.com|fb\.me/i.test(href) || /Facebook/i.test(text)) {
          track("contact_click", { channel: "FACEBOOK" });
          return;
        }

        if (/^tel:/i.test(href)) {
          track("contact_click", { channel: "PHONE" });
          return;
        }

        if (el.classList?.contains("dealerNavBtn")) {
          track("dealer_entry_click");
        }
      },
      { capture: true, passive: true }
    );
  }

  function installVisibilityTracking() {
    const startedAt = Date.now();
    let sent = false;

    const sendEngagement = () => {
      if (sent) return;
      sent = true;
      const seconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
      if (seconds >= 5) {
        track("engagement", {
          seconds: Math.min(seconds, 3600),
          tab: getPageName() === "PRICE_SHEET" ? currentTab() : "",
        });
      }
    };

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendEngagement();
    });

    window.addEventListener("pagehide", sendEngagement, { once: true });
  }

  function init() {
    installClickTracking();
    installVisibilityTracking();

    // Geo lookup is analytics-only and never blocks page rendering.
    // Initial view waits only for this background lookup (max ~2.5s) so the
    // first event can include province when available.
    ensureGeo().finally(trackInitialView);

    // Small public API for future explicit events without coupling to this file.
    window.LeeplusAnalytics = Object.freeze({
      track,
      version: "1.1.0",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
