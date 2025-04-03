// Import the functions directly from the module itself rather than using the mocked version
// This bypasses Jest's automatic mocking of the module
const actualModule = jest.requireActual('../a11yUtils');
const {
  focusById,
  handleKeyboardNavigation,
  createScreenReaderAnnouncer,
  getAriaBoolean,
  generateA11yId
} = actualModule;

// Mock document functions
document.getElementById = jest.fn();
document.createElement = jest.fn();
document.body.appendChild = jest.fn();

describe('a11yUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('focusById', () => {
    it('focuses element when it exists', () => {
      const mockElement = {
        focus: jest.fn()
      };
      
      document.getElementById.mockReturnValueOnce(mockElement);
      
      const result = focusById('test-id');
      
      expect(document.getElementById).toHaveBeenCalledWith('test-id');
      expect(mockElement.focus).toHaveBeenCalledWith({ preventScroll: true });
      expect(result).toBe(true);
    });
    
    it('passes scroll option when specified', () => {
      const mockElement = {
        focus: jest.fn()
      };
      
      document.getElementById.mockReturnValueOnce(mockElement);
      
      focusById('test-id', true);
      
      expect(mockElement.focus).toHaveBeenCalledWith({ preventScroll: false });
    });
    
    it('returns false when element does not exist', () => {
      document.getElementById.mockReturnValueOnce(null);
      
      const result = focusById('nonexistent-id');
      
      expect(document.getElementById).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBe(false);
    });
  });
  
  describe('handleKeyboardNavigation', () => {
    it('calls callback on Enter key press', () => {
      const mockCallback = jest.fn();
      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn()
      };
      
      handleKeyboardNavigation(mockEvent, mockCallback);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });
    
    it('calls callback on Space key press', () => {
      const mockCallback = jest.fn();
      const mockEvent = {
        key: ' ',
        preventDefault: jest.fn()
      };
      
      handleKeyboardNavigation(mockEvent, mockCallback);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });
    
    it('does not call callback on other keys', () => {
      const mockCallback = jest.fn();
      const mockEvent = {
        key: 'Tab',
        preventDefault: jest.fn()
      };
      
      handleKeyboardNavigation(mockEvent, mockCallback);
      
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
  
  describe('createScreenReaderAnnouncer', () => {
    it('creates announcer if it does not exist', () => {
      const mockElement = {
        id: 'sr-announcer',
        className: '',
        setAttribute: jest.fn(),
        style: {}
      };
      
      document.getElementById.mockReturnValueOnce(null);
      document.createElement.mockReturnValueOnce(mockElement);
      
      const announcer = createScreenReaderAnnouncer();
      
      // Check if the element was created with correct attributes
      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(mockElement.id).toBe('sr-announcer');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
      
      // Check if styles are set correctly
      expect(mockElement.style.position).toBe('absolute');
      expect(mockElement.style.width).toBe('1px');
      expect(mockElement.style.height).toBe('1px');
      expect(mockElement.style.overflow).toBe('hidden');
      expect(mockElement.style.clip).toBe('rect(0, 0, 0, 0)');
      
      // Check if element was appended
      expect(document.body.appendChild).toHaveBeenCalledWith(mockElement);
    });
    
    it('reuses existing announcer if it exists', () => {
      const mockElement = {
        id: 'sr-announcer',
        setAttribute: jest.fn()
      };
      
      document.getElementById.mockReturnValueOnce(mockElement);
      
      createScreenReaderAnnouncer();
      
      expect(document.createElement).not.toHaveBeenCalled();
      expect(document.body.appendChild).not.toHaveBeenCalled();
    });
    
    it('announces messages with polite priority by default', () => {
      // Mock setTimeout
      jest.useFakeTimers();
      
      const mockElement = {
        id: 'sr-announcer',
        setAttribute: jest.fn(),
        textContent: ''
      };
      
      document.getElementById.mockReturnValueOnce(mockElement);
      
      const announcer = createScreenReaderAnnouncer();
      announcer.announce('Test message');
      
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
      expect(mockElement.textContent).toBe('');
      
      // Run the setTimeout
      jest.runAllTimers();
      
      expect(mockElement.textContent).toBe('Test message');
      
      jest.useRealTimers();
    });
    
    it('announces messages with assertive priority', () => {
      // Mock setTimeout
      jest.useFakeTimers();
      
      const mockElement = {
        id: 'sr-announcer',
        setAttribute: jest.fn(),
        textContent: ''
      };
      
      document.getElementById.mockReturnValueOnce(mockElement);
      
      const announcer = createScreenReaderAnnouncer();
      announcer.announceAssertive('Important message');
      
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
      
      // Run the setTimeout
      jest.runAllTimers();
      
      expect(mockElement.textContent).toBe('Important message');
      
      jest.useRealTimers();
    });
  });
  
  describe('getAriaBoolean', () => {
    it('returns "true" for boolean true', () => {
      expect(getAriaBoolean(true)).toBe('true');
    });
    
    it('returns "false" for boolean false', () => {
      expect(getAriaBoolean(false)).toBe('false');
    });
    
    it('returns "true" for truthy values', () => {
      expect(getAriaBoolean(1)).toBe('true');
      expect(getAriaBoolean('text')).toBe('true');
      expect(getAriaBoolean({})).toBe('true');
      expect(getAriaBoolean([])).toBe('true');
    });
    
    it('returns "false" for falsy values', () => {
      expect(getAriaBoolean(0)).toBe('false');
      expect(getAriaBoolean('')).toBe('false');
      expect(getAriaBoolean(null)).toBe('false');
      expect(getAriaBoolean(undefined)).toBe('false');
      expect(getAriaBoolean(NaN)).toBe('false');
    });
  });
  
  describe('generateA11yId', () => {
    // Skip testing the mocked function since it's already mocked globally
    it('generates unique IDs', () => {
      // Test the real implementation
      const realGenerateA11yId = actualModule.generateA11yId;
      
      const id1 = realGenerateA11yId();
      const id2 = realGenerateA11yId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^a11y-/);
      expect(id2).toMatch(/^a11y-/);
    });
    
    it('uses custom prefix when provided', () => {
      // Test the real implementation
      const realGenerateA11yId = actualModule.generateA11yId;
      
      const id = realGenerateA11yId('custom');
      
      expect(id).toMatch(/^custom-/);
    });
  });
}); 