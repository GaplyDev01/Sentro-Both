// Global mocks for Jest tests

// Mock the a11yUtils module
jest.mock('./src/utils/a11yUtils', () => ({
  generateA11yId: jest.fn().mockReturnValue('test-id-123'),
}), { virtual: true });

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Mock our component that's causing issues
jest.mock('./components/common/ResponsiveTypography', () => {
  return {
    __esModule: true,
    default: ({ 
      children, 
      variant, 
      mobileVariant,
      tabletVariant,
      align,
      color,
      sx = {},
      ...props 
    }) => (
      <div 
        data-testid="mock-responsive-typography" 
        data-variant={variant}
        data-mobile-variant={mobileVariant}
        data-tablet-variant={tabletVariant}
        data-align={align}
        data-color={color}
        data-sx={JSON.stringify(sx)}
        {...props}
      >
        {children}
      </div>
    ),
  };
}, { virtual: true });

// Setup for React's useState when used for generating IDs in AccessibleForm
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  
  return {
    ...originalReact,
    useState: jest.fn((initial) => {
      // For the formId and statusId, return fixed values for testing
      if (typeof initial === 'string' && initial.startsWith('form-')) {
        return ['form-test-id-123', jest.fn()];
      }
      if (typeof initial === 'string' && initial.startsWith('status-')) {
        return ['status-test-id-123', jest.fn()];
      }
      // For other useState calls, use the actual implementation
      return originalReact.useState(initial);
    }),
  };
});

// Mock Material UI components and hooks
jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: jest.fn().mockReturnValue({
      breakpoints: {
        down: jest.fn().mockImplementation(size => size === 'sm'),
        between: jest.fn().mockImplementation((start, end) => start === 'sm' && end === 'md'),
        up: jest.fn(),
      },
      zIndex: {
        drawer: 1200,
        appBar: 1100,
        tooltip: 1500,
      },
      palette: {
        primary: { main: '#1976d2' },
        background: { default: '#fff', paper: '#fff' },
      },
      typography: {
        h6: { fontSize: '1.25rem' },
        body1: { fontSize: '1rem' },
        body2: { fontSize: '0.875rem' },
      },
    }),
    useMediaQuery: jest.fn().mockReturnValue(false),
    CircularProgress: () => <div aria-label="Loading">Loading...</div>,
    Box: ({ children, ...props }) => <div data-testid="mui-box" {...props}>{children}</div>,
    Paper: ({ children, ...props }) => <div data-testid="mui-paper" {...props}>{children}</div>,
    Typography: ({ children, ...props }) => <div data-testid="mui-typography" {...props}>{children}</div>,
    Button: ({ children, ...props }) => <button data-testid="mui-button" {...props}>{children}</button>,
  };
});

// Add any additional global mocks here 