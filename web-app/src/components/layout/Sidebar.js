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
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Updated teal colors with more subtle shades
  const tealColors = {
    lighter: '#E0F2F1',
    light: '#B2DFDB',
    main: '#00897B',
    dark: '#00695C',
    contrastText: '#FFFFFF'
  };

  // Updated background colors
  const bgColors = {
    default: 'rgba(255, 255, 255, 0.98)',
    hover: 'rgba(224, 242, 241, 0.5)',
    active: 'rgba(178, 223, 219, 0.15)'
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogOut = () => {
    console.log('Logout clicked');
    logout();
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
        height: '48px',
        pl: isHovering || isMobile ? 2 : 0,
        justifyContent: isHovering || isMobile ? 'flex-start' : 'center',
        transition: 'all 0.3s ease',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '3px',
          background: tealColors.main,
          borderRadius: '0 4px 4px 0',
          opacity: activeItem === to ? 1 : 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          backgroundColor: bgColors.hover,
          '& .MuiListItemIcon-root': {
            color: tealColors.main,
          },
        },
        ...(activeItem === to && {
          backgroundColor: bgColors.active,
          '& .MuiListItemIcon-root': {
            color: tealColors.main,
          },
          '& .MuiListItemText-primary': {
            color: tealColors.main,
            fontWeight: 500,
          },
        }),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: isHovering || isMobile ? '16px' : '50%',
          transform: isHovering || isMobile ? 'none' : 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          color: activeItem === to ? tealColors.main : alpha(tealColors.dark, 0.6),
          transition: 'all 0.3s ease',
        }}
      >
        {icon}
      </Box>
      <ListItemText 
        primary={primary}
        sx={{
          ml: 5,
          opacity: isHovering || isMobile ? 1 : 0,
          transform: isHovering || isMobile ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'all 0.3s ease',
          '& .MuiTypography-root': {
            color: activeItem === to ? tealColors.main : alpha(theme.palette.text.primary, 0.87),
            fontWeight: activeItem === to ? 500 : 400,
          }
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
        justifyContent: 'space-between',
        background: 'transparent',
      }}
    >
      <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        <ListItemStyled
          to="/mattress"
          icon={<BedIcon />}
          primary="Mattresses"
        />
        <ListItemStyled
          to="/mattress-types"
          icon={<CategoryIcon />}
          primary="Types"
        />
        <ListItemStyled
          to="/groups"
          icon={<GroupIcon />}
          primary="Groups"
        />
        <ListItemStyled
          to="/users"
          icon={<PersonIcon />}
          primary="Users"
        />
        {/* <ListItemStyled
          to="/history"
          icon={<HistoryIcon />}
          primary="History"
        /> */}
        <ListItemStyled
          to="/reports"
          icon={<AssessmentIcon />}
          primary="Reports"
        />
        {/* <ListItemStyled
          to="/dpp"
          icon={<DescriptionIcon />}
          primary="DPP"
        /> */}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogOut}
          sx={{
            py: 1.5,
            minWidth: (!isHovering && !isMobile) ? '40px' : 'auto',
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${tealColors.main} 0%, ${tealColors.dark} 100%)`,
            boxShadow: `0 2px 8px ${alpha(tealColors.main, 0.25)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${alpha(tealColors.main, 0.35)}`,
              background: `linear-gradient(135deg, ${tealColors.dark} 0%, ${tealColors.main} 100%)`,
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
          }}>
            <LogoutIcon fontSize="small" />
            <span style={{ 
              opacity: isHovering || isMobile ? 1 : 0,
              transform: isHovering || isMobile ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.3s ease',
              display: (!isHovering && !isMobile) ? 'none' : 'inline',
            }}>
              Logout
            </span>
          </Box>
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {!isMobile ? (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 118,
            bottom: 0,
            width: isHovering ? 240 : 72,
            backgroundColor: bgColors.default,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            zIndex: 1200,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.03)}`,
            backdropFilter: 'blur(8px)',
            '&:hover': {
              width: 240,
              backgroundColor: bgColors.default,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
            },
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MenuItems />
        </Box>
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
              bgcolor: alpha(tealColors.main, 0.9),
              color: tealColors.contrastText,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: tealColors.main,
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
                height: '100%',
                background: bgColors.default,
                boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.05)}`,
                backdropFilter: 'blur(8px)',
              },
            }}
          >
            <Box sx={{ height: '100%', pt: '80px' }}>
              <MenuItems />
            </Box>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Sidebar;
