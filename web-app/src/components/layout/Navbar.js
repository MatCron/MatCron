import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Popover,
  CardContent,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Avatar,
  Tooltip,
  alpha,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { grey, red, blue, green } from '@mui/material/colors';
import CustomSidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';

import logo from '../../assets/images/MATCRON_Logo.png';    

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current page name from path
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.split('/').pop().charAt(0).toUpperCase() + path.split('/').pop().slice(1);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Replace with your user ID logic
      const userId = 'exampleUserId';
      const response = await axios.get(`/api/notifications/adminnotifications?userId=${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleSidebarToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMarkAsRead = async (notificationIds) => {
    try {
      // Replace with your user ID logic
      const userId = 'exampleUserId';
      await axios.post(`/api/notifications/marknotificationsasread`, {
        userId,
        notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
      });
      setNotifications(notifications.filter(n => !notificationIds.includes(n.id)));
    } catch (error) {
      console.error('Error marking notification as read:', error.response ? error.response.data : error.message);
    }
  };

  const handleMarkAllAsRead = () => {
    const allNotificationIds = notifications.map(n => n.id);
    handleMarkAsRead(allNotificationIds);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: '#008080', 
          zIndex: 1100,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '64px', md: '70px' } }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {isMobile ? (
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                  <img
                    src={logo}
                    alt="Company Logo"
                    style={{ 
                      maxHeight: '50px',
                      marginRight: '5px', // Reduced from 10px
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                    onClick={() => navigate('/')}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FFFFFF', 
                      fontWeight: 'bold', 
                      fontSize: '1.1rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    MatCron
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <IconButton 
                    color="inherit" 
                    onClick={handleNotificationClick}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: alpha('#ffffff', 0.1),
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Badge 
                      badgeContent={notifications.length} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          height: '18px',
                          minWidth: '18px',
                          padding: '0 4px'
                        }
                      }}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    color="inherit"
                    edge="end"
                    onClick={handleSidebarToggle}
                    sx={{
                      ml: 0.5,
                      '&:hover': { 
                        backgroundColor: alpha('#ffffff', 0.1),
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={logo}
                    alt="Company Logo"
                    style={{ 
                      maxHeight: '60px',
                      marginRight: '10px', // Reduced from 20px
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                    onClick={() => navigate('/')}
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      flexGrow: 1, 
                      fontSize: '1.6rem', 
                      color: '#FFFFFF', 
                      fontWeight: 'bold',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    MatCron
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Dashboard">
                    <IconButton 
                      color="inherit"
                      onClick={() => navigate('/')}
                      sx={{ 
                        mx: 0.5,
                        '&:hover': { 
                          backgroundColor: alpha('#ffffff', 0.1),
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Help">
                    <IconButton 
                      color="inherit"
                      sx={{ 
                        mx: 0.5,
                        '&:hover': { 
                          backgroundColor: alpha('#ffffff', 0.1),
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton 
                      color="inherit"
                      sx={{ 
                        mx: 0.5,
                        '&:hover': { 
                          backgroundColor: alpha('#ffffff', 0.1),
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton 
                    color="inherit" 
                    onClick={handleNotificationClick}
                    sx={{ 
                      mx: 0.5,
                      '&:hover': { 
                        backgroundColor: alpha('#ffffff', 0.1),
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Badge 
                      badgeContent={notifications.length} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          height: '18px',
                          minWidth: '18px',
                          padding: '0 4px'
                        }
                      }}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <Tooltip title="Profile">
                    <IconButton 
                      sx={{ 
                        ml: 1,
                        '&:hover': { 
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Avatar 
                        alt="User" 
                        src="/static/images/avatar/1.jpg" 
                        sx={{ 
                          width: 38, 
                          height: 38,
                          border: '2px solid white'
                        }} 
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* CustomSidebar component outside the AppBar */}
      <CustomSidebar open={drawerOpen} onClose={handleSidebarToggle} />
      
      {/* Full-width subnavbar with breadcrumb positioned slightly to the right */}
      <Toolbar 
        sx={{ 
          backgroundColor: grey[200], 
          minHeight: '48px !important',
          width: '100%',
          position: 'fixed',
          top: { xs: '64px', md: '70px' },
          zIndex: 1000,
          borderBottom: `1px solid ${grey[300]}`,
          display: 'flex',
          justifyContent: 'flex-start', // Changed back to flex-start
          pl: { xs: 2, md: 10 } // Added padding-left to position it slightly to the right
        }}
      >
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            '& .MuiBreadcrumbs-ol': {
              alignItems: 'center'
            }
          }}
        >
          <MuiLink 
            underline="hover" 
            color="inherit" 
            href="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '0.9rem',
              color: grey[600],
              '&:hover': { color: '#008080' }
            }}
          >
            <DashboardIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            Home
          </MuiLink>
          <Typography 
            color="text.primary"
            sx={{ 
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#008080',
            }}
          >
            {getPageName()}
          </Typography>
        </Breadcrumbs>
      </Toolbar>

      <div style={{ height: '120px' }}></div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 4,
          sx: { 
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <Paper sx={{ minWidth: 320, maxWidth: 380, maxHeight: '400px', overflowY: 'auto' }}>
          <Box sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 1, 
            backgroundColor: '#008080', 
            color: 'white',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Notifications
            </Typography>
            <IconButton size="small" onClick={handleNotificationClose} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box p={2}>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <Box
                  key={notification.id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                    p: 2,
                    backgroundColor: alpha(grey[100], 0.7),
                    border: `1px solid ${grey[200]}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: 16,
                      backgroundColor:
                        notification.processStatus === 0 ? red[500] :
                          notification.processStatus === 3 ? green[600] :
                            blue[500],
                      color: 'white',
                      padding: '2px 8px',
                      fontWeight: 'bold',
                      borderRadius: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {notification.processStatus === 0 ? "NEW" :
                      notification.processStatus === 3 ? "Paid" :
                        "Updated"}
                  </Typography>
                  <CardContent sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0 !important',
                    '&:last-child': { paddingBottom: 0 }
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {notification.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(notification.updated).toLocaleDateString()} • {new Date(notification.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    <Tooltip title="Mark as read">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: alpha('#008080', 0.1),
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <CheckCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </CardContent>
                </Box>
              ))
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 4
                }}
              >
                <NotificationsIcon sx={{ fontSize: 48, color: grey[400], mb: 2 }} />
                <Typography sx={{ color: grey[600] }}>No notifications</Typography>
              </Box>
            )}
          </Box>
          {notifications.length > 0 && (
            <Box sx={{ 
              position: 'sticky', 
              bottom: 0, 
              zIndex: 1, 
              backgroundColor: 'white', 
              p: 2,
              borderTop: `1px solid ${grey[200]}`
            }}>
              <Button
                variant="contained"
                sx={{ 
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: '#008080',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#006666',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAllAsRead}
                fullWidth
              >
                Mark all as read
              </Button>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default Navbar;
