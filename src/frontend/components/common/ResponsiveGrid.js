import React from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A responsive grid component that adapts column count based on screen size
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Grid items
 * @param {number} props.spacing - Grid spacing
 * @param {number} props.xs - Grid columns for extra small screens
 * @param {number} props.sm - Grid columns for small screens
 * @param {number} props.md - Grid columns for medium screens
 * @param {number} props.lg - Grid columns for large screens
 * @param {number} props.xl - Grid columns for extra large screens
 * @param {Object} props.sx - Additional styles
 * @returns {JSX.Element} - Responsive grid component
 */
const ResponsiveGrid = ({
  children,
  spacing = 2,
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  xl = 3,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Adjust spacing based on screen size
  const responsiveSpacing = isMobile ? 1 : (isTablet ? 2 : spacing);

  // Convert children to array for processing
  const childrenArray = React.Children.toArray(children);

  return (
    <Grid container spacing={responsiveSpacing} sx={{ width: '100%', ...sx }}>
      {childrenArray.map((child, index) => (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={index}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  spacing: PropTypes.number,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  sx: PropTypes.object,
};

export default ResponsiveGrid; 