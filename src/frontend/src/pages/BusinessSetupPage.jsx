import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Language as LanguageIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateBusinessDetails } from '../services/userService';

// Industry options
const industries = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance & Banking' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Energy', label: 'Energy & Utilities' },
  { value: 'Education', label: 'Education' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Transportation', label: 'Transportation & Logistics' },
  { value: 'Entertainment', label: 'Entertainment & Media' },
  { value: 'Food', label: 'Food & Beverage' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'RealEstate', label: 'Real Estate' },
  { value: 'Nonprofit', label: 'Nonprofit' },
  { value: 'Other', label: 'Other' }
];

// Company size options
const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1001-5000', label: '1001-5000 employees' },
  { value: '5001+', label: '5001+ employees' }
];

// Validation schema
const businessInfoSchema = yup.object({
  businessName: yup.string().required('Business name is required'),
  industry: yup.string().required('Industry is required'),
  location: yup.string().required('Location is required'),
  size: yup.string().required('Company size is required'),
  website: yup.string().url('Enter a valid URL').nullable(),
}).required();

// Step content components
const BusinessInfoStep = ({ control, errors }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Basic Business Information
    </Typography>
    <Typography variant="body2" color="textSecondary" paragraph>
      Tell us about your business so we can personalize news and insights.
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="businessName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Business Name"
              variant="outlined"
              fullWidth
              error={!!errors.businessName}
              helperText={errors.businessName?.message}
              InputProps={{
                startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Location"
              variant="outlined"
              fullWidth
              error={!!errors.location}
              helperText={errors.location?.message}
              placeholder="City, Country"
              InputProps={{
                startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Website"
              variant="outlined"
              fullWidth
              error={!!errors.website}
              helperText={errors.website?.message}
              placeholder="https://example.com"
              InputProps={{
                startAdornment: <LanguageIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  </>
);

const IndustrySelectionStep = ({ control, errors }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Industry & Size
    </Typography>
    <Typography variant="body2" color="textSecondary" paragraph>
      Help us understand your business context for better news relevance.
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.industry}>
          <InputLabel id="industry-label">Industry</InputLabel>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="industry-label"
                label="Industry"
                startAdornment={<CategoryIcon color="action" sx={{ mr: 1 }} />}
              >
                {industries.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.industry && <FormHelperText>{errors.industry.message}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.size}>
          <InputLabel id="size-label">Company Size</InputLabel>
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="size-label"
                label="Company Size"
                startAdornment={<GroupIcon color="action" sx={{ mr: 1 }} />}
              >
                {companySizes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.size && <FormHelperText>{errors.size.message}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  </>
);

const ReviewStep = ({ formData }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Review Your Information
    </Typography>
    <Typography variant="body2" color="textSecondary" paragraph>
      Please confirm that everything is correct before submitting.
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Business Name
              </Typography>
              <Typography variant="body1">{formData.businessName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Location
              </Typography>
              <Typography variant="body1">{formData.location}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Industry
              </Typography>
              <Typography variant="body1">
                {industries.find(i => i.value === formData.industry)?.label || formData.industry}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Company Size
              </Typography>
              <Typography variant="body1">
                {companySizes.find(s => s.value === formData.size)?.label || formData.size}
              </Typography>
            </Grid>
            {formData.website && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Website
                </Typography>
                <Typography variant="body1">{formData.website}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </>
);

const steps = ['Business Information', 'Industry & Size', 'Review'];

export default function BusinessSetupPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, updateBusinessDetails: updateAuthBusinessDetails } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form setup
  const { control, handleSubmit, formState: { errors }, getValues, reset } = useForm({
    resolver: yupResolver(businessInfoSchema),
    defaultValues: {
      businessName: currentUser?.business?.name || '',
      industry: currentUser?.business?.industry || '',
      location: currentUser?.business?.location || '',
      size: currentUser?.business?.size || '',
      website: currentUser?.business?.website || '',
    }
  });

  // Prefill form if user already has business details
  useEffect(() => {
    if (currentUser?.business) {
      reset({
        businessName: currentUser.business.name || '',
        industry: currentUser.business.industry || '',
        location: currentUser.business.location || '',
        size: currentUser.business.size || '',
        website: currentUser.business.website || '',
      });
    }
  }, [currentUser, reset]);

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (activeStep === steps.length - 1) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        await updateBusinessDetails({
          name: data.businessName,
          industry: data.industry,
          location: data.location,
          size: data.size,
          website: data.website || null,
        });
        
        // Update the context with new business details
        await updateAuthBusinessDetails({
          name: data.businessName,
          industry: data.industry,
          location: data.location,
          size: data.size,
          website: data.website || null,
        });
        
        setSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        console.error('Error updating business details:', err);
        setError(err.response?.data?.message || 'Failed to update business details. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleNext();
    }
  };

  return (
    <Box maxWidth="md" sx={{ mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Business Setup
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Set up your business profile to get personalized news and impact predictions
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Business Profile Updated!
            </Typography>
            <Typography variant="body1" paragraph>
              Your business profile has been successfully updated. You will be redirected to the homepage.
            </Typography>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
              {activeStep === 0 && <BusinessInfoStep control={control} errors={errors} />}
              {activeStep === 1 && <IndustrySelectionStep control={control} errors={errors} />}
              {activeStep === 2 && <ReviewStep formData={getValues()} />}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting && activeStep === steps.length - 1 ? <CircularProgress size={20} /> : null}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
} 