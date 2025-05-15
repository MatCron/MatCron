import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Grid,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhotoCamera as PhotoCameraIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/MATCRON_Logo.png';
import EncryptionService from '../services/EncryptionService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

const ConfirmRegistration = () => {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (!tokenFromUrl) {
      setSnackbar({
        open: true,
        message: 'Invalid or missing token in URL',
        severity: 'error'
      });
      setVerifying(false);
      setLoading(false);
      return;
    }
    
    setToken(tokenFromUrl);
    verifyToken(tokenFromUrl);
  }, [location]);

  // Verify token with backend
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Auth/verify`, {
        params: { token: tokenToVerify }
      });
      
      if (response.data.success) {
        setEmail(response.data.email);
        setSnackbar({
          open: true,
          message: 'Email verified successfully. Please complete your registration.',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Token verification failed',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to verify token. Please try again.',
        severity: 'error'
      });
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      general: ''
    };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // If there's a profile picture, we'd typically upload it to a storage service
      // and get back a URL. For this example, we'll just use the local URL or a placeholder.
      const profilePictureUrlToSend = profilePictureUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${firstName} ${lastName}`);
      
      // Encrypt the password before sending it to the backend
      const encryptedPassword = EncryptionService.encryptPassword(password);
      
      const registrationData = {
        token,
        firstName,
        lastName,
        password: encryptedPassword, // Send the encrypted password
        profilePicture: profilePictureUrlToSend
      };
      
      console.log('Sending registration data with encrypted password');
      
      const response = await axios.post(`${BASE_URL}/api/Auth/complete-registration`, registrationData);
      
      setSnackbar({
        open: true,
        message: 'Registration completed successfully! You can now log in.',
        severity: 'success'
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        general: error.response?.data?.message || 'Failed to complete registration. Please try again.'
      });
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to complete registration. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // If still loading or verifying, show loading spinner
  if (loading || verifying) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          backgroundImage: 'linear-gradient(to bottom right, rgba(0,137,123,0.05), rgba(0,137,123,0.1))',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img src={logo} alt="MatCron Logo" style={{ height: '60px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Verifying your email...
          </Typography>
        </Box>
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        backgroundImage: 'linear-gradient(to bottom right, rgba(0,137,123,0.05), rgba(0,137,123,0.1))',
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: { xs: 4, sm: 8 }
          }}
        >
          <img src={logo} alt="MatCron Logo" style={{ height: '60px', marginBottom: '16px' }} />
          
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              width: '100%',
              borderRadius: 3,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              backgroundColor: alpha('#ffffff', 0.9),
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
              Complete Registration
            </Typography>
            
            <Typography variant="body1" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
              Please provide your details to complete your account setup
            </Typography>
            
            {errors.general && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errors.general}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={profilePictureUrl}
                      alt={`${firstName} ${lastName}`}
                      sx={{
                        width: 100,
                        height: 100,
                        border: `4px solid ${theme.palette.background.paper}`,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-picture-upload"
                      type="file"
                      onChange={handleProfilePictureChange}
                    />
                    <label htmlFor="profile-picture-upload">
                      <IconButton
                        component="span"
                        sx={{
                          position: 'absolute',
                          right: -8,
                          bottom: -8,
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.secondary }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={email}
                    disabled
                    variant="outlined"
                    sx={{
                      mb: 3,
                      backgroundColor: alpha(theme.palette.action.disabledBackground, 0.1),
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    variant="outlined"
                    required
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    variant="outlined"
                    required
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0,137,123,0.2)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: '0 6px 16px rgba(0,137,123,0.3)',
                  }
                }}
              >
                {submitting ? 'Processing...' : 'Complete Registration'}
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Already have an account?{' '}
                  <Button
                    onClick={() => navigate('/login')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfirmRegistration; 