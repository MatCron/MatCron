import React, { useState, useEffect } from 'react';
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
  TableRow,
  CircularProgress
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
import MattressService from '../services/MattressService';

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
  const [detailedMattress, setDetailedMattress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch detailed mattress data when drawer opens
  useEffect(() => {
    const fetchMattressDetails = async () => {
      if (mattress && open) {
        setLoading(true);
        setError(null);
        try {
          const response = await MattressService.getMattressById(mattress.id);
          if (response.success && response.data) {
            setDetailedMattress(response.data);
          } else {
            setError('Failed to load mattress details');
          }
        } catch (err) {
          console.error('Error fetching mattress details:', err);
          setError('Error loading mattress details. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMattressDetails();
  }, [mattress, open]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sample history data (would be replaced with API data in a real implementation)
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

      {/* Loading State */}
      {loading && (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ color: '#008080', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">Loading mattress details...</Typography>
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Warning sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => onClose()}
          >
            Close
          </Button>
        </Box>
      )}

      {/* Content when data is loaded */}
      {!loading && !error && (
        <>
          {/* Mattress Details Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    Basic Information
                  </Typography>
                  <Chip 
                    label={MattressService.getStatusString(mattress.status)} 
                    size="small" 
                    color={MattressService.getStatusColor(mattress.status)}
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
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EventAvailable sx={{ color: '#64748b', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Lifecycle End Date</Typography>
                        <Typography variant="body1" fontWeight="medium">{formatDate(mattress.lifeCyclesEnd)}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {detailedMattress && (
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                    Additional Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {detailedMattress.batchNo && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Batch Number</Typography>
                            <Typography variant="body1" fontWeight="medium">{detailedMattress.batchNo}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {detailedMattress.productionDate && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarToday sx={{ color: '#64748b', mr: 1 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">Production Date</Typography>
                            <Typography variant="body1" fontWeight="medium">{formatDate(detailedMattress.productionDate)}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {detailedMattress.epcCode && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">EPC Code</Typography>
                            <Typography variant="body1" fontWeight="medium">{detailedMattress.epcCode}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Lifecycle Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={getLifecyclePercentage(mattress.lifeCyclesEnd)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getLifecyclePercentage(mattress.lifeCyclesEnd) > 75 ? '#ef4444' : 
                                  getLifecyclePercentage(mattress.lifeCyclesEnd) > 50 ? '#f59e0b' : '#10b981'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {getDaysRemaining(mattress.lifeCyclesEnd)} days remaining
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(getLifecyclePercentage(mattress.lifeCyclesEnd))}% used
                      </Typography>
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
              )}
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
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.02)'
                          }
                        }}
                      >
                        <ListItemIcon>
                          {item.action === 'Rotation' ? <Autorenew sx={{ color: '#008080' }} /> :
                           item.action === 'Cleaning' ? <CheckCircle sx={{ color: '#10b981' }} /> :
                           <History sx={{ color: '#6366f1' }} />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body1" fontWeight="medium">
                              {item.action}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(item.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                By: {item.user}
                              </Typography>
                              {item.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {item.notes}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index < historyData.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          </TabPanel>

          {/* Mattress Type Tab */}
          <TabPanel value={tabValue} index={2}>
            {detailedMattress && detailedMattress.mattressType ? (
              <Box>
                <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                  {detailedMattress.mattressType.name} Specifications
                </Typography>
                
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Property</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>{detailedMattress.mattressType.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dimensions</TableCell>
                          <TableCell>{`${detailedMattress.mattressType.width} × ${detailedMattress.mattressType.length} × ${detailedMattress.mattressType.height} cm`}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Width</TableCell>
                          <TableCell>{detailedMattress.mattressType.width} cm</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Length</TableCell>
                          <TableCell>{detailedMattress.mattressType.length} cm</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Height</TableCell>
                          <TableCell>{detailedMattress.mattressType.height} cm</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Composition</TableCell>
                          <TableCell>{detailedMattress.mattressType.composition}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Washable</TableCell>
                          <TableCell>{detailedMattress.mattressType.washable ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Rotation Interval</TableCell>
                          <TableCell>{detailedMattress.mattressType.rotationInterval} days</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Recycling Details</TableCell>
                          <TableCell>{detailedMattress.mattressType.recyclingDetails}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Expected Lifespan</TableCell>
                          <TableCell>{detailedMattress.mattressType.expectedLifespan} years</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Warranty Period</TableCell>
                          <TableCell>{detailedMattress.mattressType.warrantyPeriod} years</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Current Stock</TableCell>
                          <TableCell>{detailedMattress.mattressType.stock} units</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <InfoIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Mattress Type Information Not Available
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Detailed mattress type information could not be loaded.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </>
      )}
    </Drawer>
  );
};

export default MattressDetailDrawer;