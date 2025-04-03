// Mock implementation of ResponsiveTypography
const React = require('react');

const ResponsiveTypography = ({ children, variant, ...props }) => (
  <div data-testid="mock-responsive-typography" {...props}>
    {children}
  </div>
);

module.exports = ResponsiveTypography;
module.exports.default = ResponsiveTypography; 