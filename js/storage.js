/**
 * Creator Bio-Stack Builder - Storage Module
 * Manages localStorage synchronization for themes, profile settings, links, and analytics.
 */

// Storage keys
const KEYS = {
  THEME: 'biostack_theme',
  PROFILE: 'biostack_profile',
  LINKS: 'biostack_links'
};

// Beautiful initial seed data to wow the user on first load
const DEFAULT_LINKS = [
  {
    id: '1',
    title: '🌐 Personal Portfolio Website',
    url: 'https://myportfolio.com',
    clicks: 124
  },
  {
    id: '2',
    title: '📸 Follow my Journey on Instagram',
    url: 'https://instagram.com/creator',
    clicks: 86
  },
  {
    id: '3',
    title: '🎬 Subscribe on YouTube',
    url: 'https://youtube.com/creator',
    clicks: 298
  }
];

const DEFAULT_PROFILE = {
  name: 'alex_dev',
  bio: 'Digital Creator • Building interactive web experiences with modern JavaScript modules.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  followerCount: 4800
};

/**
 * Safely fetches data from localStorage.
 * @param {string} key - Storage key.
 * @param {*} defaultValue - Fallback value if storage empty.
 * @returns {*} - Parsed data or fallback.
 */
function safeGet(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely writes data to localStorage.
 * @param {string} key - Storage key.
 * @param {*} value - Value to serialize.
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
}

/**
 * Get saved theme setting.
 * @returns {string} - 'dark' or 'light'.
 */
export function getTheme() {
  try {
    const stored = localStorage.getItem(KEYS.THEME);
    if (stored) return stored;
    // Auto-detect browser dark/light mode preference if no setting exists
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersDark ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Save theme preference.
 * @param {string} theme - 'dark' or 'light'.
 */
export function setTheme(theme) {
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme to storage:', error);
  }
}

/**
 * Fetch links stack.
 * @returns {Array<Object>} - Saved links array.
 */
export function getLinks() {
  return safeGet(KEYS.LINKS, DEFAULT_LINKS);
}

/**
 * Save links stack.
 * @param {Array<Object>} links - Array of link objects.
 */
export function setLinks(links) {
  safeSet(KEYS.LINKS, links);
}

/**
 * Fetch creator profile details.
 * @returns {Object} - Creator name, bio, avatar, and followers.
 */
export function getProfile() {
  return safeGet(KEYS.PROFILE, DEFAULT_PROFILE);
}

/**
 * Save creator profile details.
 * @param {Object} profile - Creator profile object.
 */
export function setProfile(profile) {
  safeSet(KEYS.PROFILE, profile);
}

/**
 * Clears entire app state and reloads seed defaults.
 */
export function resetAppState() {
  try {
    localStorage.removeItem(KEYS.THEME);
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.LINKS);
  } catch (error) {
    console.error('Error clearing app state:', error);
  }
}
