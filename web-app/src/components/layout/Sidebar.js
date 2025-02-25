import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  alpha,
} from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogOut = async () => {
    navigate('/login');
  };

  const ListItemStyled = ({ to, icon, primary, onClick }) => (
    <ListItem
      button
      component={Link}
      to={to}
      onClick={() => {
        setActiveItem(to);
        onClick && onClick();
      }}
      sx={{
        mb: 1,
        mx: 1,
        borderRadius: 2,
        position: 'relative',
        pl: 2,
        justifyContent: 'center',
        transition: 'all 0.5s ease',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '3px',
          background: theme.palette.primary.main,
          borderRadius: '0 4px 4px 0',
          opacity: activeItem === to ? 1 : 0,
          transition: 'opacity 0.5s ease',
        },
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          transform: 'translateX(4px)',
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
            transform: 'scale(1.2)',
          },
        },
        ...(activeItem === to && {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
          },
          '& .MuiListItemText-primary': {
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
        }),
      }}
    >
      {icon && (
        <ListItemIcon
          sx={{
            minWidth: 48,
            justifyContent: 'center',
            transition: 'all 0.5s ease',
          }}
        >
          {icon}
        </ListItemIcon>
      )}
      <ListItemText 
        primary={primary}
        sx={{
          color: theme.palette.teal.main,
          opacity: isHovering || isMobile ? 1 : 0,
          transition: 'opacity 0.5s ease',
          display: (!isHovering && !isMobile) ? 'none' : 'block',
          textAlign: 'center',
        }}
      />
    </ListItem>
  );

  const MenuItems = () => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: theme.palette.background.paper,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        <ListItemStyled
          to="/mattresses"
          icon={<BedIcon />}
          primary="Mattresses"
        />
        <ListItemStyled
          to="/types"
          icon={<CategoryIcon />}
          primary="Types"
        />
        <ListItemStyled
          to="/groups"
          icon={<GroupIcon />}
          primary="Groups"
        />
        <ListItemStyled
          to="/history"
          icon={<HistoryIcon />}
          primary="History"
        />
        <ListItemStyled
          to="/reports"
          icon={<AssessmentIcon />}
          primary="Reports"
        />
        <ListItemStyled
          to="/dpp"
          icon={<DescriptionIcon />}
          primary="DPP"
        />
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          color="error"
          onClick={handleLogOut}
          startIcon={isHovering || isMobile ? <LogoutIcon /> : null}
          sx={{
            py: 1.5,
            minWidth: (!isHovering && !isMobile) ? '40px' : 'auto',
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.25)',
            transition: 'all 0.5s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.35)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          {!isHovering && !isMobile ? (
            <LogoutIcon fontSize="small" />
          ) : (
            'Logout'
          )}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {!isMobile ? (
        <Drawer
          variant="permanent"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            width: isHovering ? 240 : 72,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isHovering ? 240 : 72,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'hidden',
              marginTop: '64px',
              height: 'calc(100% - 64px)',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.teal.main, 0.1),
            },
          }}
        >
          <MenuItems />
        </Drawer>
      ) : (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: 'fixed',
              left: 16,
              top: 16,
              zIndex: theme.zIndex.drawer + 2,
              bgcolor: theme.palette.teal.main,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: theme.palette.teal.dark,
                transform: 'scale(1.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 240,
                marginTop: '64px',
                height: 'calc(100% - 64px)',
                background: theme.palette.background.paper,
                boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItems />
          </Drawer>
        </>
      )}
    </>
  );
};

export default Sidebar;