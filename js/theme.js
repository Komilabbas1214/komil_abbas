/**
 * Creator Bio-Stack Builder - Theme Module
 * Controls the Light/Dark mode state, DOM classes/attributes, and persistence.
 */
import { getTheme, setTheme } from './storage.js';

/**
 * Initializes theme based on localStorage preference or system settings.
 * Applies the correct attributes to the document node.
 */
export function initTheme() {
  const activeTheme = getTheme();
  applyTheme(activeTheme);
}

/**
 * Toggles the theme between dark and light, updating persistence.
 * @returns {string} - The new active theme name.
 */
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  applyTheme(newTheme);
  setTheme(newTheme);
  
  return newTheme;
}

/**
 * Internal helper to update HTML attributes and toggle transitions.
 * @param {string} theme - 'dark' or 'light'.
 */
function applyTheme(theme) {
  // Apply data-theme attribute on root HTML node for CSS targeting
  document.documentElement.setAttribute('data-theme', theme);
  
  // Set accessibility/aria state on toggle button if selector ready
  const themeToggleBtn = document.querySelector('#theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}
