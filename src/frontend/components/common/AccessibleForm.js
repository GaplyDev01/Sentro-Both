import React, { useState } from 'react';
import { Box, FormHelperText, Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { generateA11yId } from '../../utils/a11yUtils';

/**
 * An enhanced form component with improved accessibility features
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Submit handler
 * @param {string} props.submitText - Text for submit button
 * @param {boolean} props.loading - Loading state
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.successMessage - Success message to display
 * @param {boolean} props.disabled - Whether the form is disabled
 * @param {string} props.ariaLabel - ARIA label for the form
 * @param {Object} props.sx - Additional styles
 * @returns {JSX.Element} - Accessible form component
 */
const AccessibleForm = ({
  children,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  errorMessage = '',
  successMessage = '',
  disabled = false,
  ariaLabel = 'Form',
  sx = {},
}) => {
  const [formId] = useState(`form-${generateA11yId()}`);
  const [statusId] = useState(`status-${generateA11yId()}`);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!loading && !disabled && onSubmit) {
      onSubmit(event);
    }
  };
  
  return (
    <Box 
      component="form"
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      aria-label={ariaLabel}
      aria-busy={loading ? 'true' : 'false'}
      aria-disabled={disabled ? 'true' : 'false'}
      aria-describedby={statusId}
      sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx,
      }}
    >
      {children}
      
      {(errorMessage || successMessage) && (
        <FormHelperText
          id={statusId}
          error={!!errorMessage}
          sx={{ 
            fontWeight: 'medium',
            fontSize: '0.875rem',
            color: successMessage ? 'success.main' : 'error.main',
            margin: '8px 0',
          }}
        >
          {errorMessage || successMessage}
        </FormHelperText>
      )}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || disabled}
        aria-disabled={loading || disabled ? 'true' : 'false'}
        sx={{ 
          mt: 2,
          position: 'relative',
          minHeight: '36px',
        }}
      >
        {submitText}
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
            aria-label="Loading"
          />
        )}
      </Button>
      
      {/* Visually hidden element for screen reader feedback */}
      {(loading || disabled) && (
        <Box
          className="sr-only"
          sx={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          aria-live="polite"
        >
          {loading ? 'Form submission in progress. Please wait.' : 'Form is currently disabled.'}
        </Box>
      )}
    </Box>
  );
};

AccessibleForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  sx: PropTypes.object,
};

export default AccessibleForm; 