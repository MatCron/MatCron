import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  alpha,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManagerIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';

// User role enum mapping to match backend
const UserRoleEnum = {
  ADMIN: 0,
  MANAGER: 1,
  USER: 2
};

const InviteUserDialog = ({ open, onClose, onInvite }) => {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('User');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const theme = useTheme();
  const { user } = useAuth();

  const handleInvite = async () => {
    if (!email.trim()) {
      if (onInvite) {
        onInvite(null, null, new Error('Please enter an email address.'));
      }
      setError('Please enter an email address.');
      return;
    }
    if (!email.includes('@')) {
      if (onInvite) {
        onInvite(null, null, new Error('Please enter a valid email address.'));
      }
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Convert role string to enum value (byte)
      let userRole;
      switch (role) {
        case 'Admin':
          userRole = UserRoleEnum.ADMIN; // 0
          break;
        case 'Manager':
          userRole = UserRoleEnum.MANAGER; // 1
          break;
        case 'User':
          userRole = UserRoleEnum.USER; // 2
          break;
        default:
          userRole = UserRoleEnum.USER; // Default to User
      }
      
      console.log('Inviting user with role:', role, 'mapped to byte value:', userRole);
      console.log('Organization ID:', user.orgId);
      
      // Call the API to invite user
      await UserService.inviteUser(email, userRole, user.orgId);
      
      // Call the original onInvite if it exists (for backward compatibility)
      if (onInvite) {
        onInvite(email, role);
      }
      
      // Clear form and close dialog
      setEmail('');
      setRole('User');
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error in handleInvite:', error);
      setLoading(false);
      setError(error.response?.data?.message || 'Failed to send invitation. Please try again.');
      if (onInvite) {
        onInvite(null, null, error);
      }
    }
  };

  const getRoleColor = (roleType) => {
    switch (roleType) {
      case 'Admin':
        return theme.palette.primary.main;
      case 'Manager':
        return theme.palette.info.main;
      case 'User':
        return theme.palette.grey[600];
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          maxWidth: '500px',
          width: '100%',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Invite a New User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Send an invitation email to add a new team member
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
          placeholder="Enter user's email address"
        />

        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Select Role & Permissions
        </Typography>
        
        <RadioGroup
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${role === 'Admin' ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: role === 'Admin' ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: role === 'Admin' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.divider, 0.05)
              }
            }}
          >
            <FormControlLabel 
              value="Admin" 
              control={<Radio color="primary" />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Administrator</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Full access to all features and settings, including user management and system configuration
                  </Typography>
                </Box>
              }
            />
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${role === 'Manager' ? theme.palette.info.main : alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: role === 'Manager' ? alpha(theme.palette.info.main, 0.05) : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: role === 'Manager' ? alpha(theme.palette.info.main, 0.08) : alpha(theme.palette.divider, 0.05)
              }
            }}
          >
            <FormControlLabel 
              value="Manager" 
              control={<Radio color="info" />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ManagerIcon sx={{ color: theme.palette.info.main }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Manager</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Can manage team members, content, and view analytics. Cannot modify system settings
                  </Typography>
                </Box>
              }
            />
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              mb: 1, 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${role === 'User' ? theme.palette.grey[500] : alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: role === 'User' ? alpha(theme.palette.grey[500], 0.05) : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: role === 'User' ? alpha(theme.palette.grey[500], 0.08) : alpha(theme.palette.divider, 0.05)
              }
            }}
          >
            <FormControlLabel 
              value="User" 
              control={<Radio color="default" />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UserIcon sx={{ color: theme.palette.grey[600] }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Regular User</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Basic access to view and interact with content. No administrative privileges
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleInvite}
          variant="contained"
          startIcon={loading ? null : <CheckIcon />}
          disabled={!email.trim() || loading}
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            '&.Mui-disabled': {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send Invitation'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserDialog;
