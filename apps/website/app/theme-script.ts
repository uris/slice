/** Fixed source only: never interpolate cookies, query parameters, or other user data here. */
export const themeScript = `
(() => {
  let theme = 'darkMode';
  try {
    const saved = document.cookie.split('; ').find(value => value.startsWith('slice-theme='))?.split('=')[1];
    if (saved === 'lightMode') theme = 'lightMode';
  } catch {
    // Retain the default when browser storage is unavailable.
  }
  document.documentElement.dataset.sliceTheme = theme;
})();
`;
