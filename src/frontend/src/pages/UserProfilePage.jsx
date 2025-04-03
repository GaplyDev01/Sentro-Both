import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Validation schemas
const personalInfoSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9+\-() ]*$/, 'Enter a valid phone number'),
  jobTitle: yup.string(),
});

const businessInfoSchema = yup.object({
  businessName: yup.string().required('Business name is required'),
  industry: yup.string().required('Industry is required'),
  location: yup.string().required('Location is required'),
  size: yup.string().required('Company size is required'),
  website: yup.string().url('Enter a valid URL').nullable(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export default function UserProfilePage() {
  const theme = useTheme();
  const { currentUser, updateProfile, updateBusinessDetails } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize forms
  const personalInfoForm = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      jobTitle: currentUser?.jobTitle || '',
    },
  });

  const businessInfoForm = useForm({
    resolver: yupResolver(businessInfoSchema),
    defaultValues: {
      businessName: currentUser?.business?.name || '',
      industry: currentUser?.business?.industry || '',
      location: currentUser?.business?.location || '',
      size: currentUser?.business?.size || '',
      website: currentUser?.business?.website || '',
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setEditMode(false);
    clearMessages();
  };

  // Toggle edit mode
  const handleToggleEdit = () => {
    setEditMode(!editMode);
    clearMessages();

    // Reset form if canceling edit
    if (editMode) {
      if (activeTab === 0) {
        personalInfoForm.reset({
          firstName: currentUser?.firstName || '',
          lastName: currentUser?.lastName || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          jobTitle: currentUser?.jobTitle || '',
        });
      } else if (activeTab === 1) {
        businessInfoForm.reset({
          businessName: currentUser?.business?.name || '',
          industry: currentUser?.business?.industry || '',
          location: currentUser?.business?.location || '',
          size: currentUser?.business?.size || '',
          website: currentUser?.business?.website || '',
        });
      }
    }
  };

  // Clear success/error messages
  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handle personal info form submit
  const onPersonalInfoSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearMessages();

      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        jobTitle: data.jobTitle,
      });

      setSuccessMessage('Personal information updated successfully');
      setEditMode(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update personal information');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle business info form submit
  const onBusinessInfoSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearMessages();

      await updateBusinessDetails({
        name: data.businessName,
        industry: data.industry,
        location: data.location,
        size: data.size,
        website: data.website,
      });

      setSuccessMessage('Business information updated successfully');
      setEditMode(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update business information');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password form submit
  const onPasswordSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearMessages();

      // This would need a backend endpoint to handle password changes
      // For now, simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Password updated successfully');
      passwordForm.reset();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return '?';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View and manage your account information
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Personal Info" />
          <Tab icon={<BusinessIcon />} label="Business Details" />
          <Tab icon={<LockIcon />} label="Password" />
        </Tabs>

        {/* Personal Info Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: theme.palette.primary.main,
                    mr: 2,
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {currentUser?.email}
                  </Typography>
                  {currentUser?.jobTitle && (
                    <Chip
                      label={currentUser.jobTitle}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Box>
              <Button
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                onClick={handleToggleEdit}
                color={editMode ? 'error' : 'primary'}
                variant={editMode ? 'outlined' : 'contained'}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    disabled={!editMode}
                    {...personalInfoForm.register('firstName')}
                    error={!!personalInfoForm.formState.errors.firstName}
                    helperText={personalInfoForm.formState.errors.firstName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    disabled={!editMode}
                    {...personalInfoForm.register('lastName')}
                    error={!!personalInfoForm.formState.errors.lastName}
                    helperText={personalInfoForm.formState.errors.lastName?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    disabled={!editMode}
                    {...personalInfoForm.register('email')}
                    error={!!personalInfoForm.formState.errors.email}
                    helperText={personalInfoForm.formState.errors.email?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    disabled={!editMode}
                    {...personalInfoForm.register('phone')}
                    error={!!personalInfoForm.formState.errors.phone}
                    helperText={personalInfoForm.formState.errors.phone?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    variant="outlined"
                    disabled={!editMode}
                    {...personalInfoForm.register('jobTitle')}
                    error={!!personalInfoForm.formState.errors.jobTitle}
                    helperText={personalInfoForm.formState.errors.jobTitle?.message}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Box>
        )}

        {/* Business Details Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Business Information</Typography>
              <Button
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                onClick={handleToggleEdit}
                color={editMode ? 'error' : 'primary'}
                variant={editMode ? 'outlined' : 'contained'}
              >
                {editMode ? 'Cancel' : 'Edit Business Info'}
              </Button>
            </Box>

            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <form onSubmit={businessInfoForm.handleSubmit(onBusinessInfoSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    variant="outlined"
                    disabled={!editMode}
                    {...businessInfoForm.register('businessName')}
                    error={!!businessInfoForm.formState.errors.businessName}
                    helperText={businessInfoForm.formState.errors.businessName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    variant="outlined"
                    disabled={!editMode}
                    {...businessInfoForm.register('industry')}
                    error={!!businessInfoForm.formState.errors.industry}
                    helperText={businessInfoForm.formState.errors.industry?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    variant="outlined"
                    disabled={!editMode}
                    {...businessInfoForm.register('location')}
                    error={!!businessInfoForm.formState.errors.location}
                    helperText={businessInfoForm.formState.errors.location?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Size"
                    variant="outlined"
                    disabled={!editMode}
                    {...businessInfoForm.register('size')}
                    error={!!businessInfoForm.formState.errors.size}
                    helperText={businessInfoForm.formState.errors.size?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    variant="outlined"
                    disabled={!editMode}
                    {...businessInfoForm.register('website')}
                    error={!!businessInfoForm.formState.errors.website}
                    helperText={businessInfoForm.formState.errors.website?.message}
                    placeholder="https://example.com"
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Box>
        )}

        {/* Password Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Change Password
            </Typography>

            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    variant="outlined"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    error={!!passwordForm.formState.errors.currentPassword}
                    helperText={passwordForm.formState.errors.currentPassword?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    error={!!passwordForm.formState.errors.newPassword}
                    helperText={passwordForm.formState.errors.newPassword?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    variant="outlined"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    error={!!passwordForm.formState.errors.confirmPassword}
                    helperText={passwordForm.formState.errors.confirmPassword?.message}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Paper>
    </Box>
  );
} 