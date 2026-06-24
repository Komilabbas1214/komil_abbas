/**
 * Creator Bio-Stack Builder - Main App Orchestrator
 * Bootstraps the application, registers events, and manages state.
 */

import { initTheme, toggleTheme } from './theme.js';
import { getLinks, setLinks, getProfile, setProfile } from './storage.js';
import { validateRequired, validateUrl } from './validation.js';
import { DOM, renderProfile, renderLinks, toggleValidationError } from './ui.js';

// Core In-Memory Application State
let activeLinks = [];
let activeProfile = {};

/**
 * Initializes the entire application state and registers listeners.
 */
function init() {
  // 1. Bootstrap theme preferences
  initTheme();

  // 2. Hydrate state from localStorage
  activeLinks = getLinks();
  activeProfile = getProfile();

  // 3. Render initial views
  renderProfile(activeProfile);
  renderLinks(activeLinks);

  // 4. Register all event listeners
  registerEventListeners();
}

/**
 * Registers all interactives event listeners on the dashboard and preview components.
 */
function registerEventListeners() {
  
  // ==========================================
  // 1. THEME ENGINE CONTROLS
  // ==========================================
  DOM.themeToggle.addEventListener('click', () => {
    toggleTheme();
  });

  // ==========================================
  // 2. PROFILE EDIT INTERACTION LISTENERS
  // ==========================================
  
  // Real-time Name Change
  DOM.inputCreatorName.addEventListener('input', (e) => {
    const cleanName = e.target.value.trim().replace(/^@/, '');
    activeProfile.name = cleanName;
    setProfile(activeProfile);
    renderProfile(activeProfile);
  });

  // Real-time Bio Change
  DOM.inputCreatorBio.addEventListener('input', (e) => {
    activeProfile.bio = e.target.value;
    setProfile(activeProfile);
    renderProfile(activeProfile);
  });

  // Real-time Custom Avatar URL Change
  DOM.inputAvatarUrl.addEventListener('input', (e) => {
    const urlValue = e.target.value.trim();
    activeProfile.avatarUrl = urlValue;
    setProfile(activeProfile);
    renderProfile(activeProfile);
  });

  // Preset Avatar dot clicked
  DOM.presetDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const presetUrl = dot.getAttribute('data-url');
      activeProfile.avatarUrl = presetUrl;
      setProfile(activeProfile);
      renderProfile(activeProfile);
    });
  });

  // Follower slider update (Syncs number input + recalculates badge threshold)
  DOM.sliderFollowerCount.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    activeProfile.followerCount = val;
    setProfile(activeProfile);
    renderProfile(activeProfile);
  });

  // Follower number input update (Syncs slider + recalculates badge threshold)
  DOM.inputFollowerCount.addEventListener('input', (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    
    activeProfile.followerCount = val;
    setProfile(activeProfile);
    renderProfile(activeProfile);
  });

  // ==========================================
  // 3. LINK SUBMISSION & VALIDATION ENGINE
  // ==========================================
  DOM.formAddLink.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents standard browser page reload refresh

    const titleValue = DOM.inputLinkTitle.value.trim();
    const urlValue = DOM.inputLinkUrl.value.trim();

    let isTitleValid = true;
    let isUrlValid = true;

    // A. Validate Title
    if (!validateRequired(titleValue)) {
      toggleValidationError(
        DOM.errorLinkTitle, 
        DOM.inputLinkTitle, 
        'Title is required and cannot be empty.'
      );
      isTitleValid = false;
    } else {
      toggleValidationError(DOM.errorLinkTitle, DOM.inputLinkTitle, '');
    }

    // B. Validate URL structure and https:// security requirement (Section B Task 2)
    if (!validateRequired(urlValue)) {
      toggleValidationError(
        DOM.errorLinkUrl,
        DOM.inputLinkUrl,
        'Destination URL is required.'
      );
      isUrlValid = false;
    } else if (!validateUrl(urlValue)) {
      toggleValidationError(
        DOM.errorLinkUrl,
        DOM.inputLinkUrl,
        'Invalid format. Must be secure (start with https://)'
      );
      isUrlValid = false;
    } else {
      toggleValidationError(DOM.errorLinkUrl, DOM.inputLinkUrl, '');
    }

    // C. Add Link to State and synchronize if valid
    if (isTitleValid && isUrlValid) {
      const newLink = {
        id: Date.now().toString(), // unique identification stamp
        title: titleValue,
        url: urlValue,
        clicks: 0
      };

      activeLinks.push(newLink);
      setLinks(activeLinks); // Save array changes in storage
      renderLinks(activeLinks); // Repaint dashboard lists & mobile frame preview

      // Reset form states
      DOM.formAddLink.reset();
      DOM.inputLinkTitle.focus();
    }
  });

  // ==========================================
  // 4. EVENT DELEGATION: DELETE ACTIONS (Section A Q5)
  // ==========================================
  DOM.editorLinksList.addEventListener('click', (e) => {
    // Find if a delete button or trash icon within a button was clicked
    const deleteBtn = e.target.closest('.btn-delete');
    if (!deleteBtn) return;

    const idToDelete = deleteBtn.getAttribute('data-id');
    const matchingRow = document.querySelector(`#editor-row-${idToDelete}`);

    if (matchingRow) {
      // Trigger a smooth exit slide animation before purging the element
      matchingRow.classList.add('slide-out-anim');
      
      matchingRow.addEventListener('animationend', () => {
        // Purge element from the DOM
        matchingRow.remove();
        
        // Update model state array
        activeLinks = activeLinks.filter(link => link.id !== idToDelete);
        setLinks(activeLinks); // persist updated array
        
        // Re-render UI to update counts, analytics panel, and simulated screen
        renderLinks(activeLinks);
      });
    }
  });

  // ==========================================
  // 5. EVENT DELEGATION: VIEWER CLICKS IN PREVIEW PANE
  // ==========================================
  DOM.previewLinksContainer.addEventListener('click', (e) => {
    // Find if a preview button link was clicked inside phone screen
    const linkBtn = e.target.closest('.preview-link-btn');
    if (!linkBtn) return;

    const clickedId = linkBtn.getAttribute('data-id');
    
    // Find in array and increment click analytical stats
    const linkIndex = activeLinks.findIndex(l => l.id === clickedId);
    if (linkIndex !== -1) {
      activeLinks[linkIndex].clicks = (activeLinks[linkIndex].clicks || 0) + 1;
      setLinks(activeLinks); // save updated analytics count
      
      // Instant repaint of stats dashboard
      renderLinks(activeLinks);
    }
  });

  // ==========================================
  // 6. ANALYTICS CARD BUTTONS
  // ==========================================
  DOM.btnResetAnalytics.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all click analytical stats to zero?')) {
      activeLinks = activeLinks.map(link => {
        link.clicks = 0;
        return link;
      });
      setLinks(activeLinks);
      renderLinks(activeLinks);
    }
  });

  // ==========================================
  // 7. MOBILE RESPONSIVE TAB BINDINGS
  // ==========================================
  DOM.tabEditor.addEventListener('click', () => {
    DOM.tabEditor.classList.add('active');
    DOM.tabPreview.classList.remove('active');
    
    DOM.dashboardPane.classList.add('active-view');
    DOM.previewPane.classList.remove('active-view');
  });

  DOM.tabPreview.addEventListener('click', () => {
    DOM.tabPreview.classList.add('active');
    DOM.tabEditor.classList.remove('active');
    
    DOM.previewPane.classList.add('active-view');
    DOM.dashboardPane.classList.remove('active-view');
  });
}

// Bootstrap app on DOM content ready loading
document.addEventListener('DOMContentLoaded', init);
