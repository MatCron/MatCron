import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
  useTheme,
  alpha,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Mail as MailIcon,
  Check as CheckIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import InviteUserDialog from './InviteUserDialog';
import CustomSnackbar from '../../components/Snackbar';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const theme = useTheme();
  const drawerWidth = 240;
  const [roleFilter, setRoleFilter] = useState('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const { user } = useAuth(); // Get the current user's context

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getOrganizationUsers(user.orgId);
      if (response.success) {
        // Transform the API response to match our component's expected format
        const transformedUsers = response.users.map(user => ({
          id: user.id,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email.split('@')[0],
          email: user.email,
          role: user.userRole === 0 ? 'Admin' : 'User',
          status: 'Active', // You might want to add a status field in your API
          avatar: `https://ui-avatars.com/api/?name=${
            user.firstName ? user.firstName : user.email
          }&background=random`
        }));
        setUsers(transformedUsers);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // TODO: Implement delete user API call
        // await UserService.deleteUser(userId);
        
        setUsers(users.filter(user => user.id !== userId));
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete user. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenRoleDialog = () => {
    setNewRole(selectedUser.role);
    setOpenRoleDialog(true);
    handleMenuClose();
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);
  };

  const handleSaveRole = async () => {
    try {
      // TODO: Implement update user role API call
      // await UserService.updateUserRole(selectedUser.id, newRole);
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      ));
      
      handleCloseRoleDialog();
      setSnackbar({
        open: true,
        message: 'User role updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update user role. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
  };

  const handleInviteUser = async (email, role, error) => {
    if (error) {
        setSnackbar({
            open: true,
            message: error.message || 'Failed to send invitation. Please try again.',
            severity: 'error'
        });
        return;
    }
    
    setSnackbar({
        open: true,
        message: 'User invitation sent successfully!',
        severity: 'success'
    });
    
    // Refresh the users list
    fetchUsers();
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleRoleFilterChange = (newRole) => {
    setRoleFilter(newRole);
    handleFilterClose();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadMore = () => {
    setRowsPerPage(rowsPerPage + 8);
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
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

  // Get status color
  const getStatusColor = (status) => {
    return status === 'Active' ? theme.palette.success.main : theme.palette.warning.main;
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar open={false} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          marginTop: '120px',
          marginLeft: { xs: 0, md: `${drawerWidth}px` },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: alpha(theme.palette.background.default, 0.4),
          minHeight: 'calc(100vh - 120px)',
          position: 'fixed',
          right: 0,
          overflowY: 'auto',
          height: '100vh',
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <Typography variant="h4" sx={{ 
            color: theme.palette.text.primary, 
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}>
            Users Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenInviteDialog}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              alignSelf: { xs: 'stretch', sm: 'auto' }
            }}
          >
            Invite New User
          </Button>
        </Box>

        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ 
              width: { xs: '100%', sm: '350px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={roleFilter === 'all' ? 'All Roles' : roleFilter}
              onClick={handleFilterClick}
              deleteIcon={<FilterListIcon />}
              onDelete={handleFilterClick}
              sx={{ 
                borderRadius: 2,
                backgroundColor: roleFilter === 'all' 
                  ? alpha(theme.palette.grey[500], 0.1)
                  : alpha(getRoleColor(roleFilter), 0.1),
                color: roleFilter === 'all'
                  ? theme.palette.text.primary
                  : getRoleColor(roleFilter),
                '& .MuiChip-deleteIcon': {
                  color: 'inherit'
                }
              }}
            />
          </Box>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                minWidth: 180
              }
            }}
          >
            <MenuItem 
              onClick={() => handleRoleFilterChange('all')}
              selected={roleFilter === 'all'}
            >
              All Roles
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => handleRoleFilterChange('Admin')}
              selected={roleFilter === 'Admin'}
              sx={{ color: theme.palette.primary.main }}
            >
              Admin
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleFilterChange('Manager')}
              selected={roleFilter === 'Manager'}
              sx={{ color: theme.palette.info.main }}
            >
              Manager
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleFilterChange('User')}
              selected={roleFilter === 'User'}
              sx={{ color: theme.palette.grey[600] }}
            >
              User
            </MenuItem>
          </Menu>
        </Box>

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedUsers.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      height: '100%',
                      minHeight: 120,
                      width: '100%',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: getRoleColor(user.role),
                        borderRadius: '2px 2px 0 0'
                      }
                    }}
                  >
                    {/* Menu button in the top right corner */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: theme.palette.text.secondary,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          color: theme.palette.primary.main
                        },
                        width: 28,
                        height: 28
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>

                    {/* User info with horizontal layout */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: getStatusColor(user.status),
                              border: '2px solid white'
                            }}
                          />
                        }
                      >
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{ 
                            width: 50,
                            height: 50,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '2px solid white'
                          }}
                        />
                      </Badge>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '1rem',
                              color: theme.palette.text.primary
                            }}
                          >
                            {user.name}
                          </Typography>
                          
                          <Chip
                            label={user.role}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getRoleColor(user.role), 0.1),
                              color: getRoleColor(user.role),
                              fontWeight: 500,
                              height: 22,
                              fontSize: '0.7rem',
                              border: `1px solid ${alpha(getRoleColor(user.role), 0.2)}`,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center'
                        }}>
                          <MailIcon 
                            fontSize="small" 
                            sx={{ 
                              color: theme.palette.text.secondary, 
                              mr: 0.5, 
                              fontSize: '0.85rem' 
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.text.secondary,
                              fontWeight: 400,
                              fontSize: '0.85rem'
                            }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {filteredUsers.length > rowsPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={loadMore}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    px: 4,
                    py: 1,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  Load More
                </Button>
              </Box>
            )}

            {filteredUsers.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                  No users found
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 1 }}>
                  Try adjusting your search or filter to find what you're looking for.
                </Typography>
              </Paper>
            )}

            {/* User action menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <MenuItem onClick={handleOpenRoleDialog}>
                <EditIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                Change Role
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <EditIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.info.main }} />
                Edit User
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleDeleteUser(selectedUser?.id); handleMenuClose(); }}>
                <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.error.main }} />
                Delete User
              </MenuItem>
            </Menu>

            {/* Enhanced Role change dialog */}
            <Dialog 
              open={openRoleDialog} 
              onClose={handleCloseRoleDialog}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  maxWidth: '400px',
                  width: '100%'
                }
              }}
            >
              <DialogTitle sx={{ 
                pb: 1, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {selectedUser && (
                    <Avatar src={selectedUser.avatar} alt={selectedUser.name} />
                  )}
                  <Box>
                    <Typography variant="h6">Change User Role</Typography>
                    {selectedUser && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedUser.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <IconButton size="small" onClick={handleCloseRoleDialog}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select the appropriate role for this user. This will determine their access level and permissions.
                </Typography>
                <RadioGroup
                  value={newRole}
                  onChange={handleRoleChange}
                  sx={{ mt: 1 }}
                >
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 1.5, 
                      p: 1.5, 
                      borderRadius: 2,
                      border: `1px solid ${newRole === 'Admin' ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
                      backgroundColor: newRole === 'Admin' ? alpha(theme.palette.primary.main, 0.05) : 'transparent'
                    }}
                  >
                    <FormControlLabel 
                      value="Admin" 
                      control={<Radio color="primary" />} 
                      label={
                        <Box>
                          <Typography variant="subtitle2">Admin</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Full access to all features and settings
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 1.5, 
                      p: 1.5, 
                      borderRadius: 2,
                      border: `1px solid ${newRole === 'Manager' ? theme.palette.info.main : alpha(theme.palette.divider, 0.1)}`,
                      backgroundColor: newRole === 'Manager' ? alpha(theme.palette.info.main, 0.05) : 'transparent'
                    }}
                  >
                    <FormControlLabel 
                      value="Manager" 
                      control={<Radio color="info" />} 
                      label={
                        <Box>
                          <Typography variant="subtitle2">Manager</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Can manage users and content, but not system settings
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 1.5, 
                      p: 1.5, 
                      borderRadius: 2,
                      border: `1px solid ${newRole === 'User' ? theme.palette.grey[500] : alpha(theme.palette.divider, 0.1)}`,
                      backgroundColor: newRole === 'User' ? alpha(theme.palette.grey[500], 0.05) : 'transparent'
                    }}
                  >
                    <FormControlLabel 
                      value="User" 
                      control={<Radio color="default" />} 
                      label={
                        <Box>
                          <Typography variant="subtitle2">User</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Basic access to view and interact with content
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button 
                  onClick={handleCloseRoleDialog}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveRole} 
                  variant="contained"
                  startIcon={<CheckIcon />}
                  sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.dark },
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>

            {/* Add InviteUserDialog */}
            <InviteUserDialog
              open={openInviteDialog}
              onClose={handleCloseInviteDialog}
              onInvite={handleInviteUser}
            />

            <CustomSnackbar
              open={snackbar.open}
              handleClose={handleCloseSnackbar}
              message={snackbar.message}
              severity={snackbar.severity}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Users;
