(() => {
  const storageKey = "theme-preference";
  const classNameDark = "dark";

  const getColorPreference = () => {
    if (localStorage.getItem(storageKey)) {
      return localStorage.getItem(storageKey);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setPreference = (theme) => {
    localStorage.setItem(storageKey, theme);
    reflectPreference(theme);
  };

  const reflectPreference = (theme) => {
    const isDark = theme === "dark";
    document.body.classList.toggle(classNameDark, isDark);
    document.documentElement.classList.toggle("dark", isDark);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", isDark);
      toggle.textContent = isDark ? "🌙 Dark mode" : "☀️ Light mode";
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    reflectPreference(getColorPreference());

    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const next = getColorPreference() === "dark" ? "light" : "dark";
      setPreference(next);
    });
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
      setPreference(isDark ? "dark" : "light");
    });
})();
