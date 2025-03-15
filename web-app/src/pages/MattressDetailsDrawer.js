import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Chip,
  Avatar,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Close,
  KingBed,
  LocationOn,
  Business,
  Loop,
  EventAvailable,
  Edit,
  History,
  Category,
  ArrowForward,
  CheckCircle,
  Info as InfoIcon,
  Warning,
  CalendarToday,
  Person,
  Autorenew
} from '@mui/icons-material';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mattress-tabpanel-${index}`}
      aria-labelledby={`mattress-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MattressDetailDrawer = ({ open, onClose, mattress }) => {
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'In production':
        return 'success';
      case 'Transferred out':
        return 'error';
      default:
        return 'default';
    }
  };

  // Calculate days remaining until lifecycle end
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate lifecycle percentage
  const getLifecyclePercentage = (endDate) => {
    if (!endDate) return 0;
    const daysRemaining = getDaysRemaining(endDate);
    // Assuming a 3-year lifecycle (1095 days)
    const totalDays = 1095;
    const daysUsed = totalDays - daysRemaining;
    return Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
  };

  // Sample history data
  const historyData = [
    { 
      date: '2023-05-15', 
      action: 'Rotation', 
      user: 'John Smith',
      notes: 'Regular scheduled rotation'
    },
    { 
      date: '2023-02-10', 
      action: 'Cleaning', 
      user: 'Maria Garcia',
      notes: 'Deep cleaning performed'
    },
    { 
      date: '2022-11-22', 
      action: 'Inspection', 
      user: 'David Johnson',
      notes: 'Passed quality inspection'
    },
    { 
      date: '2022-08-05', 
      action: 'Rotation', 
      user: 'John Smith',
      notes: 'Regular scheduled rotation'
    }
  ];

  // Sample mattress type data
  const mattressTypeData = {
    name: mattress?.type || 'Unknown',
    dimensions: mattress?.type === 'King' ? '76" x 80"' : 
                mattress?.type === 'Queen' ? '60" x 80"' : 
                mattress?.type === 'Single' ? '39" x 75"' : 'Unknown',
    materials: ['Memory Foam', 'Pocket Springs', 'Natural Latex'],
    firmness: 'Medium Firm',
    warranty: '10 years',
    features: [
      'Hypoallergenic Cover',
      'Edge Support',
      'Motion Isolation',
      'Temperature Regulation'
    ]
  };

  if (!mattress) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500, md: 700 },
          maxWidth: '100%',
          bgcolor: '#f8fafc'
        }
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#008080',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'white', mr: 2 }}>
            <KingBed sx={{ color: '#008080' }} />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {mattress.type} Mattress Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              py: 2
            },
            '& .Mui-selected': {
              color: '#008080'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#008080',
              height: 3
            }
          }}
        >
          <Tab label="Mattress Details" />
          <Tab label="History" />
          <Tab label="Mattress Type" />
        </Tabs>
      </Box>

      {/* Mattress Details Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#1e293b">
                Basic Information
              </Typography>
              <Chip 
                label={mattress.status} 
                size="small" 
                color={getStatusColor(mattress.status)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <KingBed sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Type</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattress.type}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattress.location}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Organisation</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattress.organisation}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Loop sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Days to Rotate</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattress.daysToRotate} days</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Lifecycle Information
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventAvailable sx={{ color: '#64748b', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">Lifecycle Ends</Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  fontWeight="medium"
                  color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main'}
                >
                  {new Date(mattress.lifeCyclesEnd).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Days Remaining</Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium"
                  color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main'}
                >
                  {getDaysRemaining(mattress.lifeCyclesEnd)} days
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Lifecycle Progress</Typography>
                  <Typography 
                    variant="caption" 
                    fontWeight="medium"
                    color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main'}
                  >
                    {Math.round(getLifecyclePercentage(mattress.lifeCyclesEnd))}% used
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getLifecyclePercentage(mattress.lifeCyclesEnd)} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                sx={{ 
                  borderColor: '#008080',
                  color: '#008080',
                  '&:hover': {
                    borderColor: '#006666',
                    bgcolor: 'rgba(0,128,128,0.04)'
                  }
                }}
              >
                Edit Details
              </Button>
            </Box>
          </Paper>
        </Box>
      </TabPanel>

      {/* History Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
            Mattress History
          </Typography>
          
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {historyData.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      borderLeft: '4px solid',
                      borderLeftColor: 
                        item.action === 'Rotation' ? '#008080' :
                        item.action === 'Cleaning' ? '#3b82f6' :
                        '#f59e0b',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.action === 'Rotation' ? (
                        <Autorenew sx={{ color: '#008080' }} />
                      ) : item.action === 'Cleaning' ? (
                        <CheckCircle sx={{ color: '#3b82f6' }} />
                      ) : (
                        <InfoIcon sx={{ color: '#f59e0b' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {item.action}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Person fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                            {item.user}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {item.notes}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < historyData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              endIcon={<ArrowForward />}
              sx={{ 
                borderColor: '#008080',
                color: '#008080',
                '&:hover': {
                  borderColor: '#006666',
                  bgcolor: 'rgba(0,128,128,0.04)'
                }
              }}
            >
              View Full History
            </Button>
          </Box>
        </Box>
      </TabPanel>

      {/* Mattress Type Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
            {mattressTypeData.name} Mattress Specifications
          </Typography>
          
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Dimensions
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {mattressTypeData.dimensions}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Firmness
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {mattressTypeData.firmness}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Warranty
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {mattressTypeData.warranty}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#1e293b" gutterBottom>
              Materials
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {mattressTypeData.materials.map((material, index) => (
                <Chip 
                  key={index}
                  label={material}
                  sx={{ 
                    bgcolor: 'rgba(0,128,128,0.1)',
                    color: '#008080',
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold" color="#1e293b" gutterBottom sx={{ mt: 3 }}>
              Features
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableBody>
                  {mattressTypeData.features.map((feature, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' }
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircle fontSize="small" sx={{ color: '#008080', mr: 1 }} />
                          {feature}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<Category />}
              sx={{ 
                bgcolor: '#008080',
                '&:hover': {
                  bgcolor: '#006666',
                }
              }}
            >
              View All Mattress Types
            </Button>
          </Box>
        </Box>
      </TabPanel>
    </Drawer>
  );
};

export default MattressDetailDrawer;