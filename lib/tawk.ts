declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export function loadTawkSupport() {
  if (typeof window === "undefined") return;

  // If already loaded and initialized, maximize the widget
  if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
    try {
      window.Tawk_API.maximize();
      return;
    } catch (e) {
      console.error("Error maximizing Tawk widget:", e);
    }
  }

  // Initialize Tawk timing
  window.Tawk_LoadStart = new Date();
  window.Tawk_API = window.Tawk_API || {};

  // Auto-maximize once loaded
  window.Tawk_API.onLoad = function () {
    try {
      if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
        window.Tawk_API.maximize();
      }
    } catch (e) {
      console.error("Error maximizing Tawk after load:", e);
    }
  };

  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = "https://embed.tawk.to/6a76077a941ab01d456d7ac1/1jvegqe2o";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");

  const s0 = document.getElementsByTagName("script")[0];
  if (s0 && s0.parentNode) {
    s0.parentNode.insertBefore(s1, s0);
  } else {
    document.head.appendChild(s1);
  }
}
