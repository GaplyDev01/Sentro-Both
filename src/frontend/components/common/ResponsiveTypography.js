import React from 'react';
import { Typography, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A responsive typography component that adjusts font size based on screen size
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} props.variant - Typography variant (h1, h2, h3, h4, h5, h6, body1, body2, etc.)
 * @param {string} props.mobileVariant - Variant to use on mobile screens (optional)
 * @param {string} props.tabletVariant - Variant to use on tablet screens (optional)
 * @param {string} props.align - Text alignment
 * @param {string} props.color - Text color
 * @param {Object} props.sx - Additional styles
 * @returns {JSX.Element} - Responsive typography component
 */
const ResponsiveTypography = ({
  children,
  variant = 'body1',
  mobileVariant,
  tabletVariant,
  align,
  color,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Determine variant based on screen size
  let responsiveVariant = variant;
  
  if (isMobile && mobileVariant) {
    responsiveVariant = mobileVariant;
  } else if (isTablet && tabletVariant) {
    responsiveVariant = tabletVariant;
  }

  // Calculate responsive font size
  const getResponsiveFontSize = () => {
    const baseFontSize = theme.typography[responsiveVariant]?.fontSize;
    
    if (!baseFontSize) return undefined;
    
    // If font size is already responsive (includes media queries), return as is
    if (typeof baseFontSize === 'object') return undefined;
    
    // Extract numeric value and unit
    const match = String(baseFontSize).match(/^([\d.]+)(.*)$/);
    if (!match) return undefined;
    
    const [, value, unit] = match;
    const numericValue = parseFloat(value);
    
    // Adjust font size based on screen size
    let adjustedValue = numericValue;
    
    if (isMobile) {
      adjustedValue = Math.max(numericValue * 0.85, 0.75);
    } else if (isTablet) {
      adjustedValue = Math.max(numericValue * 0.92, 0.85);
    }
    
    return `${adjustedValue}${unit}`;
  };

  const responsiveFontSize = getResponsiveFontSize();

  return (
    <Typography
      variant={responsiveVariant}
      align={align}
      color={color}
      sx={{
        fontSize: responsiveFontSize,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

ResponsiveTypography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  mobileVariant: PropTypes.string,
  tabletVariant: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  color: PropTypes.string,
  sx: PropTypes.object,
};

export default ResponsiveTypography; 