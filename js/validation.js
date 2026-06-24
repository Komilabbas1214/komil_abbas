/**
 * Creator Bio-Stack Builder - Validation Module
 * Handles real-time and submission checks for form inputs (URLs, required fields).
 */

/**
 * Validates if a required text input is empty or just whitespace.
 * @param {string} value - The input value.
 * @returns {boolean} - True if value is present, false if empty.
 */
export function validateRequired(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates if a URL is structurally sound and starts with https://.
 * @param {string} url - The URL string to test.
 * @returns {boolean} - True if valid, false if invalid.
 */
export function validateUrl(url) {
  if (!url) return false;
  
  // 1. Must explicitly start with https:// as required by Section B Task 2
  if (!url.startsWith('https://')) {
    return false;
  }

  // 2. Strict regular expression for URL matching (supporting domains, paths, query parameters)
  const urlRegex = /^https:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  
  return urlRegex.test(url);
}
