import React from 'react';
import { Container, Box, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A responsive container component that adapts to different screen sizes
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.maxWidth - Maximum width of the container (sm, md, lg, xl)
 * @param {boolean} props.disableGutters - Whether to disable container padding
 * @param {Object} props.sx - Additional styles
 * @returns {JSX.Element} - Responsive container component
 */
const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'lg', 
  disableGutters = false, 
  sx = {} 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const paddingY = isMobile ? 2 : (isTablet ? 3 : 4);
  
  return (
    <Container 
      maxWidth={maxWidth} 
      disableGutters={disableGutters}
      sx={{ 
        py: paddingY,
        ...sx
      }}
    >
      <Box 
        sx={{
          width: '100%',
          mx: 'auto',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disableGutters: PropTypes.bool,
  sx: PropTypes.object,
};

export default ResponsiveContainer; 