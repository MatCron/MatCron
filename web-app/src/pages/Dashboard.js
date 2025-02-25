import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const drawerWidth = 240;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: 'margin 0.2s',
        }}
      >
        <Typography variant="h4" sx={{ color: '#333' }}>
          Welcome to your Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', marginTop: '10px' }}>
          This is your dashboard page. You can add your content here.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;