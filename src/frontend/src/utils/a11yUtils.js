/**
 * Utility functions for accessibility (a11y)
 */

/**
 * Focus an element by ID
 * @param {string} id - The ID of the element to focus
 * @param {boolean} shouldScroll - Whether to scroll to the element
 * @returns {boolean} - True if element was focused, false if not found
 */
export const focusById = (id, shouldScroll = false) => {
  const element = document.getElementById(id);
  if (element) {
    element.focus({ preventScroll: !shouldScroll });
    return true;
  }
  return false;
};

/**
 * Handle keyboard navigation for interactive elements
 * @param {React.KeyboardEvent} event - Keyboard event
 * @param {Function} callback - Function to call on Enter or Space
 */
export const handleKeyboardNavigation = (event, callback) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback(event);
  }
};

/**
 * Create an announcer for screen readers
 * @returns {Object} - Methods to announce messages
 */
export const createScreenReaderAnnouncer = () => {
  // Create a visually hidden element for announcements
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
    
    // Add styles to hide visually but keep available to screen readers
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
  }
  
  /**
   * Announce a message to screen readers
   * @param {string} message - The message to announce
   * @param {string} priority - Priority of the announcement ('polite' or 'assertive')
   */
  const announce = (message, priority = 'polite') => {
    if (!announcer) return;
    
    // Set the appropriate aria-live attribute
    announcer.setAttribute('aria-live', priority);
    
    // Clear previous content then set new content
    // This is done in separate steps to ensure screen readers recognize the change
    announcer.textContent = '';
    
    // Use setTimeout to ensure the DOM update is registered
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  };
  
  /**
   * Announce a message with assertive priority
   * @param {string} message - The message to announce
   */
  const announceAssertive = (message) => {
    announce(message, 'assertive');
  };
  
  return {
    announce,
    announceAssertive,
  };
};

/**
 * Get a descriptive label for a status code
 * Used for aria-busy, aria-invalid, aria-expanded etc.
 * @param {boolean|string|number} status - The status value
 * @returns {string} - 'true' or 'false' string
 */
export const getAriaBoolean = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'true' : 'false';
  }
  
  // Convert truthy/falsy values to boolean strings
  return Boolean(status) ? 'true' : 'false';
};

/**
 * Generate a unique ID for use in accessibility attributes
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Unique ID
 */
export const generateA11yId = (prefix = 'a11y') => {
  return `${prefix}-${Math.floor(Math.random() * 10000)}-${Date.now().toString(36)}`;
}; 