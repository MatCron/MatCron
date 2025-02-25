import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  Tooltip, 
  useTheme, 
  alpha,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import BedIcon from '@mui/icons-material/Bed';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

// Mock data for charts
const mattressStatusData = [
  { name: 'In Use', value: 65 },
  { name: 'Need Wash', value: 15 },
  { name: 'Need Rotation', value: 12 },
  { name: 'In Storage', value: 8 }
];

const monthlyData = [
  { month: 'Jan', mattressesAdded: 12, mattressesRemoved: 5, maintenance: 8 },
  { month: 'Feb', mattressesAdded: 19, mattressesRemoved: 7, maintenance: 10 },
  { month: 'Mar', mattressesAdded: 15, mattressesRemoved: 9, maintenance: 12 },
  { month: 'Apr', mattressesAdded: 21, mattressesRemoved: 12, maintenance: 15 },
  { month: 'May', mattressesAdded: 25, mattressesRemoved: 10, maintenance: 18 },
  { month: 'Jun', mattressesAdded: 30, mattressesRemoved: 8, maintenance: 20 },
  { month: 'Jul', mattressesAdded: 28, mattressesRemoved: 15, maintenance: 22 },
  { month: 'Aug', mattressesAdded: 32, mattressesRemoved: 11, maintenance: 19 },
  { month: 'Sep', mattressesAdded: 35, mattressesRemoved: 14, maintenance: 25 },
  { month: 'Oct', mattressesAdded: 40, mattressesRemoved: 18, maintenance: 28 },
  { month: 'Nov', mattressesAdded: 38, mattressesRemoved: 20, maintenance: 24 },
  { month: 'Dec', mattressesAdded: 42, mattressesRemoved: 17, maintenance: 30 }
];

const maintenanceTypeData = [
  { name: 'Washing', count: 45 },
  { name: 'Rotation', count: 35 },
  { name: 'Repair', count: 20 },
  { name: 'Inspection', count: 30 },
  { name: 'Replacement', count: 15 }
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const drawerWidth = 240;

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.info.main
  ];

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: payload[0].payload.fill }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2">
            Count: <strong>{payload[0].value}</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {Math.round((payload[0].value / mattressStatusData.reduce((a, b) => a + b.value, 0)) * 100)}% of total
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Widget data
  const widgetData = [
    {
      title: 'Total Mattresses',
      value: 100,
      icon: <BedIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      change: '+5%'
    },
    {
      title: 'Need Washing',
      value: 15,
      icon: <LocalLaundryServiceIcon />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
      change: '+2%'
    },
    {
      title: 'Need Rotation',
      value: 12,
      icon: <RotateRightIcon />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      change: '-3%'
    },
    {
      title: 'In Storage',
      value: 8,
      icon: <InventoryIcon />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      change: '+1%'
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar open={false} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '120px', // Adjusted for navbar + subnavbar
          marginLeft: { xs: 0, md: '72px' }, // Space for sidebar
          transition: 'margin 0.2s',
          backgroundColor: alpha(theme.palette.background.default, 0.4),
          minHeight: 'calc(100vh - 120px)'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ 
                color: theme.palette.text.primary, 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}>
                Mattress Management Dashboard
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Refresh Data
              </Button>
            </Box>

            {/* Widgets Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {widgetData.map((widget, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
                        {widget.title}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: widget.bgColor,
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: widget.color
                        }}
                      >
                        {widget.icon}
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {widget.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: widget.change.startsWith('+') ? theme.palette.success.main : theme.palette.error.main,
                          fontWeight: 'bold',
                          mr: 1
                        }}
                      >
                        {widget.change}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        from last month
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3}>
              {/* Pie Chart */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Mattress Status Distribution
                    </Typography>
                    <Tooltip title="Status distribution of all mattresses in the system">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mattressStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {mattressStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                    {mattressStatusData.map((entry, index) => (
                      <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: '50%',
                            mr: 1
                          }}
                        />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {entry.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Bar Chart */}
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Maintenance Types
                    </Typography>
                    <Tooltip title="Distribution of different maintenance types">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={maintenanceTypeData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        barSize={40}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.2)} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <YAxis 
                          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <RechartsTooltip
                          cursor={{ fill: alpha(theme.palette.primary.main, 0.1) }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 4,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill={theme.palette.primary.main}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

  
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

