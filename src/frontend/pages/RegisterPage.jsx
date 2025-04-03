import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';

// Step 1 validation schema
const accountSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  firstName: yup
    .string()
    .required('First name is required'),
  lastName: yup
    .string()
    .required('Last name is required'),
});

// Step 2 validation schema
const businessSchema = yup.object({
  businessName: yup
    .string()
    .required('Business name is required'),
  industry: yup
    .string()
    .required('Industry is required'),
  location: yup
    .string()
    .required('Location is required'),
  size: yup
    .string()
    .required('Company size is required'),
});

const steps = ['Account Information', 'Business Details'];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Form 1 - Account Information
  const account = useForm({
    resolver: yupResolver(accountSchema),
    mode: 'onChange'
  });
  
  // Form 2 - Business Details
  const business = useForm({
    resolver: yupResolver(businessSchema),
    mode: 'onChange'
  });
  
  const handleNext = async (data) => {
    if (activeStep === 0) {
      setFormData({ ...formData, ...data });
      setActiveStep(1);
    } else if (activeStep === 1) {
      const completeData = { ...formData, ...data };
      try {
        setIsLoading(true);
        setError('');
        await register(completeData);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Create an Account
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {activeStep === 0 && (
            <Box component="form" onSubmit={account.handleSubmit(handleNext)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                {...account.register('firstName')}
                error={!!account.formState.errors.firstName}
                helperText={account.formState.errors.firstName?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                {...account.register('lastName')}
                error={!!account.formState.errors.lastName}
                helperText={account.formState.errors.lastName?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...account.register('email')}
                error={!!account.formState.errors.email}
                helperText={account.formState.errors.email?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                {...account.register('password')}
                error={!!account.formState.errors.password}
                helperText={account.formState.errors.password?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                {...account.register('confirmPassword')}
                error={!!account.formState.errors.confirmPassword}
                helperText={account.formState.errors.confirmPassword?.message}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
              >
                Next
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box component="form" onSubmit={business.handleSubmit(handleNext)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="businessName"
                label="Business Name"
                autoFocus
                {...business.register('businessName')}
                error={!!business.formState.errors.businessName}
                helperText={business.formState.errors.businessName?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="industry"
                label="Industry"
                {...business.register('industry')}
                error={!!business.formState.errors.industry}
                helperText={business.formState.errors.industry?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="location"
                label="Location"
                {...business.register('location')}
                error={!!business.formState.errors.location}
                helperText={business.formState.errors.location?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="size"
                label="Company Size"
                {...business.register('size')}
                error={!!business.formState.errors.size}
                helperText={business.formState.errors.size?.message}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 