/**
 * Creator Bio-Stack Builder - UI and DOM Module
 * Coordinates all direct DOM selection, content painting, and conditional badge updates.
 */

// Global DOM Cache
export const DOM = {
  // Theme Toggle Button
  themeToggle: document.querySelector('#theme-toggle'),

  // Mobile Tabs
  tabEditor: document.querySelector('#tab-editor'),
  tabPreview: document.querySelector('#tab-preview'),
  dashboardPane: document.querySelector('#dashboard-pane'),
  previewPane: document.querySelector('#preview-pane'),

  // Profile Inputs
  inputCreatorName: document.querySelector('#input-creator-name'),
  inputCreatorBio: document.querySelector('#input-creator-bio'),
  inputAvatarUrl: document.querySelector('#input-avatar-url'),
  sliderFollowerCount: document.querySelector('#slider-follower-count'),
  inputFollowerCount: document.querySelector('#input-follower-count'),
  presetDots: document.querySelectorAll('.preset-dot'),
  avatarPreviewImg: document.querySelector('#avatar-preview-img'),
  avatarFallback: document.querySelector('#avatar-fallback'),

  // Link Add Form Inputs
  formAddLink: document.querySelector('#form-add-link'),
  inputLinkTitle: document.querySelector('#input-link-title'),
  inputLinkUrl: document.querySelector('#input-link-url'),
  errorLinkTitle: document.querySelector('#error-link-title'),
  errorLinkUrl: document.querySelector('#error-link-url'),
  btnSubmitLink: document.querySelector('#btn-submit-link'),

  // Dashboard Active Links
  editorLinksList: document.querySelector('#editor-links-list'),
  linksCount: document.querySelector('#links-count'),

  // Live Phone Preview Nodes
  previewAvatar: document.querySelector('#preview-avatar'),
  previewAvatarFallback: document.querySelector('#preview-avatar-fallback'),
  previewName: document.querySelector('#preview-name'),
  previewVerifiedBadge: document.querySelector('#preview-verified-badge'),
  previewBio: document.querySelector('#preview-bio'),
  previewFollowerCount: document.querySelector('#preview-follower-count'),
  previewLinksContainer: document.querySelector('#preview-links-container'),

  // Analytics Nodes
  btnResetAnalytics: document.querySelector('#btn-reset-analytics'),
  statTotalClicks: document.querySelector('#stat-total-clicks'),
  statAvgClicks: document.querySelector('#stat-avg-clicks'),
  statTopLink: document.querySelector('#stat-top-link')
};

// Verification Threshold (Follower count >= 5,000 triggers verification)
const VERIFIED_THRESHOLD = 5000;

/**
 * Format follower count dynamically for premium presentation (e.g. 4800 -> 4.8k)
 * @param {number} count - Follower count
 * @returns {string} - Formatted count
 */
function formatFollowerCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

/**
 * Renders the entire creator profile in the live simulated smartphone preview.
 * Includes dynamic avatar image/letter fallbacks and follower-triggered verification.
 * @param {Object} profile - Creator profile details object.
 */
export function renderProfile(profile) {
  const { name, bio, avatarUrl, followerCount } = profile;

  // 1. Render Creator Name
  DOM.previewName.textContent = name ? `@${name.trim()}` : '@creator';
  if (DOM.inputCreatorName.value !== name) {
    DOM.inputCreatorName.value = name;
  }

  // 2. Render Bio
  DOM.previewBio.textContent = bio ? bio.trim() : 'No bio description provided.';
  if (DOM.inputCreatorBio.value !== bio) {
    DOM.inputCreatorBio.value = bio;
  }

  // 3. Render Formatted Follower Count
  DOM.previewFollowerCount.textContent = formatFollowerCount(followerCount);
  
  // Keep inputs and slider synchronized
  if (DOM.inputFollowerCount.value !== followerCount.toString()) {
    DOM.inputFollowerCount.value = followerCount;
  }
  if (DOM.sliderFollowerCount.value !== followerCount.toString()) {
    DOM.sliderFollowerCount.value = followerCount;
  }

  // 4. Verification Badge Conditional Logic (Section A Q2)
  // Cross-checks threshold and truthiness of the count
  if (followerCount && parseInt(followerCount, 10) >= VERIFIED_THRESHOLD) {
    DOM.previewVerifiedBadge.classList.add('visible');
  } else {
    DOM.previewVerifiedBadge.classList.remove('visible');
  }

  // 5. Avatar Render Engine with Fallback Initials
  renderAvatar(avatarUrl, name);
}

/**
 * Renders the Avatar. If url is invalid or empty, triggers a beautiful initial overlay fallback.
 * @param {string} url - Custom avatar URL or preset.
 * @param {string} username - User initials driver.
 */
export function renderAvatar(url, username) {
  const hasUrl = url && url.trim().length > 0;
  
  if (hasUrl) {
    // Attempt to load custom image
    DOM.avatarPreviewImg.src = url;
    DOM.previewAvatar.src = url;
    
    DOM.avatarPreviewImg.classList.remove('hidden');
    DOM.previewAvatar.classList.remove('hidden');
    DOM.avatarFallback.classList.add('hidden');
    DOM.previewAvatarFallback.classList.add('hidden');

    // Sync input field value
    if (DOM.inputAvatarUrl.value !== url) {
      DOM.inputAvatarUrl.value = url;
    }
  } else {
    // Generate sleek two-character initials fallback (e.g. alex_dev -> AD)
    const initials = generateInitials(username);
    
    DOM.avatarFallback.textContent = initials;
    DOM.previewAvatarFallback.textContent = initials;
    
    DOM.avatarPreviewImg.classList.add('hidden');
    DOM.previewAvatar.classList.add('hidden');
    DOM.avatarFallback.classList.remove('hidden');
    DOM.previewAvatarFallback.classList.remove('hidden');
    DOM.inputAvatarUrl.value = '';
  }

  // Highlight active preset selector if applicable
  DOM.presetDots.forEach(dot => {
    if (dot.getAttribute('data-url') === url) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/**
 * Extracts initials from username for profile fallback icons.
 * @param {string} name - Creator name.
 * @returns {string} - Two letter initials.
 */
function generateInitials(name) {
  if (!name || name.trim().length === 0) return 'JS';
  const cleanName = name.trim().replace(/^@/, '');
  if (cleanName.includes('_')) {
    const parts = cleanName.split('_');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase().substring(0, 2);
  }
  if (cleanName.includes('-')) {
    const parts = cleanName.split('-');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase().substring(0, 2);
  }
  return cleanName.substring(0, 2).toUpperCase();
}

/**
 * Renders the active links stack in BOTH the dashboard list and the mobile preview screen.
 * Uses event delegation friendly attributes (data-id) and template literal rendering.
 * @param {Array<Object>} links - Active saved links stack.
 */
export function renderLinks(links) {
  // Sync count badge in Editor Header
  DOM.linksCount.textContent = `${links.length} ${links.length === 1 ? 'link' : 'links'}`;

  // 1. Populate the Dashboard Link Manager list
  if (links.length === 0) {
    DOM.editorLinksList.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-folder-open empty-icon"></i>
        <p>Your Bio-Stack is empty.</p>
        <span>Add social links above to start customizing.</span>
      </div>
    `;
    DOM.previewLinksContainer.innerHTML = `
      <div class="empty-state" style="padding: 1.5rem 0.5rem; background: transparent; border: 1px dashed rgba(255,255,255,0.15)">
        <p style="font-size: 0.8rem; color: var(--text-muted);">No links published</p>
      </div>
    `;
  } else {
    // Generate dashboard links with template literals (Section A Q3)
    DOM.editorLinksList.innerHTML = links.map(link => `
      <div class="editor-link-row slide-in-anim" id="editor-row-${link.id}">
        <div class="link-row-info">
          <span class="link-row-title">${escapeHTML(link.title)}</span>
          <span class="link-row-url">${escapeHTML(link.url)}</span>
        </div>
        <div class="link-row-stats" title="Viewer Click Analytics">
          <i class="fa-solid fa-chart-simple"></i>
          <span>${link.clicks || 0} clicks</span>
        </div>
        <button class="btn-delete" data-id="${link.id}" aria-label="Delete this link">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    // Generate live mock phone preview buttons (Section B Task 3)
    DOM.previewLinksContainer.innerHTML = links.map(link => `
      <a href="${escapeHTML(link.url)}" target="_blank" class="preview-link-btn" data-id="${link.id}">
        <span class="btn-preview-title">${escapeHTML(link.title)}</span>
        <span class="btn-preview-icon"><i class="fa-solid fa-up-right-from-square"></i></span>
      </a>
    `).join('');
  }

  // 2. Refresh the statistics panel
  renderAnalytics(links);
}

/**
 * Escapes HTML characters to prevent potential XSS injection vulnerabilities.
 * @param {string} str - Raw input.
 * @returns {string} - Escaped output.
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders live analytics counts.
 * @param {Array<Object>} links - Active links array.
 */
export function renderAnalytics(links) {
  if (!links || links.length === 0) {
    DOM.statTotalClicks.textContent = '0';
    DOM.statAvgClicks.textContent = '0.0';
    DOM.statTopLink.textContent = '-';
    return;
  }

  // Total Clicks
  const total = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  DOM.statTotalClicks.textContent = total;

  // Average clicks per link
  const avg = (total / links.length).toFixed(1);
  DOM.statAvgClicks.textContent = avg;

  // Find most clicked link title
  let topLink = links[0];
  for (let i = 1; i < links.length; i++) {
    if ((links[i].clicks || 0) > (topLink.clicks || 0)) {
      topLink = links[i];
    }
  }

  if (topLink && topLink.clicks > 0) {
    DOM.statTopLink.textContent = topLink.title;
    DOM.statTopLink.setAttribute('title', `${topLink.title} (${topLink.clicks} clicks)`);
  } else {
    DOM.statTopLink.textContent = '-';
    DOM.statTopLink.removeAttribute('title');
  }
}

/**
 * Renders custom field validation messages.
 * @param {HTMLElement} errorNode - Container for the error message.
 * @param {HTMLInputElement} inputNode - Input target to toggle classes.
 * @param {string} msg - Error content or empty to clear.
 */
export function toggleValidationError(errorNode, inputNode, msg) {
  if (msg) {
    errorNode.textContent = msg;
    errorNode.classList.add('active');
    inputNode.classList.add('input-error');
  } else {
    errorNode.textContent = '';
    errorNode.classList.remove('active');
    inputNode.classList.remove('input-error');
  }
}
