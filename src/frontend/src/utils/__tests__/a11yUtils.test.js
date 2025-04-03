import {
  focusById,
  handleKeyboardNavigation,
  createScreenReaderAnnouncer,
  getAriaBoolean,
  generateA11yId
} from '../a11yUtils';

// Mock document methods
document.getElementById = jest.fn();
document.createElement = jest.fn();
const mockAppendChild = jest.fn();
document.body.appendChild = mockAppendChild;

describe('a11yUtils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
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
      // Mock createElement to return a simple object
      const mockElement = {
        id: '',
        className: '',
        setAttribute: jest.fn(),
        style: {}
      };
      document.createElement.mockReturnValueOnce(mockElement);
      document.getElementById.mockReturnValueOnce(null);
      
      const announcer = createScreenReaderAnnouncer();
      
      // Check if the element was created with correct attributes
      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(mockElement.id).toBe('sr-announcer');
      expect(mockElement.className).toBe('sr-only');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
      expect(document.body.appendChild).toHaveBeenCalledWith(mockElement);
      
      // Check styles
      expect(mockElement.style.position).toBe('absolute');
      expect(mockElement.style.width).toBe('1px');
      
      // Verify API
      expect(typeof announcer.announce).toBe('function');
      expect(typeof announcer.announceAssertive).toBe('function');
    });
    
    it('reuses existing announcer if it exists', () => {
      const mockElement = {
        id: 'sr-announcer',
        setAttribute: jest.fn(),
        textContent: ''
      };
      document.getElementById.mockReturnValueOnce(mockElement);
      
      createScreenReaderAnnouncer();
      
      expect(document.createElement).not.toHaveBeenCalled();
      expect(document.body.appendChild).not.toHaveBeenCalled();
    });
    
    it('announces messages with polite priority by default', () => {
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
      
      jest.advanceTimersByTime(51);
      
      expect(mockElement.textContent).toBe('Test message');
      
      jest.useRealTimers();
    });
    
    it('announces messages with assertive priority', () => {
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
      
      jest.advanceTimersByTime(51);
      
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
    beforeEach(() => {
      // Mock Math.random and Date.now for consistent IDs in tests
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      jest.spyOn(Date, 'now').mockReturnValue(1617678000000); // Consistent timestamp
    });
    
    afterEach(() => {
      jest.spyOn(Math, 'random').mockRestore();
      jest.spyOn(Date, 'now').mockRestore();
    });
    
    it('generates ID with default prefix', () => {
      const id = generateA11yId();
      expect(id).toMatch(/^a11y-\d+-[a-z0-9]+$/);
      expect(id).toBe('a11y-5000-lfn5qpvs'); // With our mocked values
    });
    
    it('uses custom prefix when provided', () => {
      const id = generateA11yId('custom');
      expect(id).toMatch(/^custom-\d+-[a-z0-9]+$/);
      expect(id).toBe('custom-5000-lfn5qpvs'); // With our mocked values
    });
    
    it('generates unique IDs for multiple calls', () => {
      // Allow real randomness for this test
      jest.spyOn(Math, 'random').mockRestore();
      jest.spyOn(Date, 'now').mockRestore();
      
      const id1 = generateA11yId();
      // Small delay to ensure different timestamp
      const id2 = generateA11yId();
      
      expect(id1).not.toBe(id2);
    });
  });
}); 