// LinkedIn Feed Guard
// On /feed: a solid orange line across the top of the window.
// While scrolling: a brighter line underneath grows with how far you've scrolled
// in this burst, and the top line pulses so you notice. Both reset when you stop.

(() => {
  const ORANGE = "#ff7a00";
  const HOT = "#ffb000";
  // Scrolling this many screen heights in one go fills the scroll line edge to edge.
  const SCREENS_TO_FILL = 5;
  const IDLE_MS = 600;

  let root = null;
  let bar = null;
  let meter = null;
  let scrolled = 0;
  let lastY = 0;
  let idleTimer = null;

  const isFeed = () => location.pathname.startsWith("/feed");

  function build() {
    root = document.createElement("div");
    root.id = "lfg-root";
    root.style.cssText = [
      "position:fixed", "top:0", "left:0", "right:0", "height:0",
      "z-index:2147483647", "pointer-events:none",
    ].join(";");

    bar = document.createElement("div");
    bar.style.cssText = [
      "position:absolute", "top:0", "left:0", "right:0", "height:4px",
      `background:${ORANGE}`, "transition:height 150ms ease, box-shadow 150ms ease",
    ].join(";");

    meter = document.createElement("div");
    meter.style.cssText = [
      "position:absolute", "top:4px", "left:0", "width:0", "height:3px",
      `background:${HOT}`, "opacity:0", "transition:opacity 300ms ease, top 150ms ease, width 300ms ease",
    ].join(";");

    root.append(bar, meter);
  }

  function mount() {
    if (!root) build();
    if (!root.isConnected) {
      (document.body || document.documentElement).appendChild(root);
      lastY = window.scrollY;
    }
  }

  function unmount() {
    if (root && root.isConnected) root.remove();
    scrolled = 0;
    if (meter) meter.style.width = "0";
  }

  function setScrolling(on) {
    bar.style.height = on ? "7px" : "4px";
    bar.style.boxShadow = on ? `0 0 12px 2px ${ORANGE}` : "none";
    meter.style.top = on ? "7px" : "4px";
    meter.style.opacity = on ? "1" : "0";
    if (!on) {
      scrolled = 0;
      meter.style.width = "0";
    }
  }

  function onScroll() {
    if (!isFeed() || !root || !root.isConnected) return;
    const y = window.scrollY;
    scrolled += Math.abs(y - lastY);
    lastY = y;

    const pct = Math.min(100, (scrolled / (window.innerHeight * SCREENS_TO_FILL)) * 100);
    meter.style.width = pct + "%";

    setScrolling(true);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => setScrolling(false), IDLE_MS);
  }

  function check() {
    if (isFeed()) {
      mount();
    } else {
      unmount();
    }
  }

  // LinkedIn is a single-page app, so URL changes don't reload the page.
  // Poll the path cheaply instead of patching history.
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      lastY = window.scrollY;
      check();
    }
    // LinkedIn sometimes rebuilds <body>; re-attach if we got dropped.
    if (isFeed() && root && !root.isConnected) mount();
  }, 500);

  window.addEventListener("scroll", onScroll, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", check, { once: true });
  } else {
    check();
  }
})();
