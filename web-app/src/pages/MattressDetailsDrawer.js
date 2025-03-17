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
  CircularProgress,
  Pagination,
  Stack,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  Autorenew,
  SwapHoriz,
  Place,
  Add,
  FilterList,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';
import MattressService from '../services/MattressService';
import { useAuth } from '../context/AuthContext';

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
  const [mattressLogs, setMattressLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('all');
  const { token } = useAuth();

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

  // Fetch mattress logs when drawer opens and tab changes to History
  useEffect(() => {
    const fetchMattressLogs = async () => {
      if (mattress && open && tabValue === 1) {
        setLogsLoading(true);
        setLogsError(null);
        try {
          const response = await MattressService.getMattressLogs(mattress.id);
          console.log('Fetched logs:', response);
          if (response && Array.isArray(response)) {
            // Sort logs by timestamp in descending order (newest first)
            const sortedLogs = response.sort((a, b) => {
              return new Date(b.timeStamp) - new Date(a.timeStamp);
            });
            setMattressLogs(sortedLogs);
          } else {
            setLogsError('Failed to load mattress logs');
          }
        } catch (err) {
          console.error('Error fetching mattress logs:', err);
          setLogsError('Error loading mattress logs. Please try again.');
        } finally {
          setLogsLoading(false);
        }
      }
    };

    fetchMattressLogs();
  }, [mattress, open, tabValue]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  // Filter logs based on type
  const getFilteredLogs = () => {
    if (filterType === 'all') return mattressLogs;
    return mattressLogs.filter(log => {
      const details = JSON.parse(log.details);
      return details.Detail.toLowerCase().includes(filterType.toLowerCase());
    });
  };

  // Get paginated logs
  const getPaginatedLogs = () => {
    const filteredLogs = getFilteredLogs();
    return filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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

  // Parse log details JSON
  const parseLogDetails = (logItem) => {
    try {
      const details = JSON.parse(logItem.details);
      console.log('Parsed log details:', details);
      
      // Determine log action and description based on the details
      let action = 'Update';
      let description = '';
      let icon = <History sx={{ color: '#6366f1' }} />;
      
      if (details.Detail === 'New Mattress Created') {
        action = 'Creation';
        if (details.result) {
          const mattressInfo = details.result;
          description = `New mattress created: ${mattressInfo.MattressTypeName} at location "${mattressInfo.location}"`;
        } else {
          description = 'New mattress created';
        }
        icon = <Add sx={{ color: '#10b981' }} />;
      } 
      else if (details.Detail === 'Updated Mattress Status') {
        action = 'Status Change';
        const originalStatus = MattressService.getStatusString(parseInt(details.Original));
        const newStatus = MattressService.getStatusString(parseInt(details.New));
        description = `Status changed from "${originalStatus}" to "${newStatus}"`;
        icon = <SwapHoriz sx={{ color: '#6366f1' }} />;
      }
      else if (details.Detail === 'Updated Mattress Location') {
        action = 'Location Change';
        description = `Location changed from "${details.Original}" to "${details.New}"`;
        icon = <Place sx={{ color: '#8b5cf6' }} />;
      }
      else if (details.Detail && details.result) {
        // Handle other types of logs with result property
        action = details.Detail;
        description = `${details.Detail} performed`;
      }
      
      // Format timestamp - handle both ISO format and DD/MM/YYYY format
      let timestamp;
      
      // Check if the timeStamp is in DD/MM/YYYY format
      if (logItem.timeStamp && logItem.timeStamp.includes('/')) {
        // Parse DD/MM/YYYY HH:MM:SS format
        const [datePart, timePart] = logItem.timeStamp.split(' ');
        const [day, month, year] = datePart.split('/');
        
        // Create date in MM/DD/YYYY format which JavaScript can parse
        timestamp = new Date(`${month}/${day}/${year} ${timePart}`);
      } else {
        // Use the ISO timestamp from the details if available
        timestamp = details.TimeStamp ? new Date(details.TimeStamp) : new Date(logItem.timeStamp);
      }
      
      // Check if the date is valid
      if (isNaN(timestamp.getTime())) {
        console.error('Invalid date:', logItem.timeStamp, details.TimeStamp);
        timestamp = new Date(); // Fallback to current date if invalid
      }
      
      const formattedDate = timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return {
        action,
        description,
        timestamp: `${formattedDate} at ${formattedTime}`,
        icon
      };
    } catch (error) {
      console.error('Error parsing log details:', error, logItem.details);
      
      // Even if parsing fails, try to format the timestamp
      let timestamp;
      try {
        if (logItem.timeStamp && logItem.timeStamp.includes('/')) {
          // Parse DD/MM/YYYY HH:MM:SS format
          const [datePart, timePart] = logItem.timeStamp.split(' ');
          const [day, month, year] = datePart.split('/');
          
          // Create date in MM/DD/YYYY format which JavaScript can parse
          timestamp = new Date(`${month}/${day}/${year} ${timePart}`);
          
          if (!isNaN(timestamp.getTime())) {
            const formattedDate = timestamp.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            const formattedTime = timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });
            
            return {
              action: 'Update',
              description: 'Log details unavailable',
              timestamp: `${formattedDate} at ${formattedTime}`,
              icon: <Warning sx={{ color: '#ef4444' }} />
            };
          }
        }
      } catch (dateError) {
        console.error('Error parsing timestamp:', dateError);
      }
      
      return {
        action: 'Update',
        description: 'Log details unavailable',
        timestamp: logItem.timeStamp || 'Unknown date',
        icon: <Warning sx={{ color: '#ef4444' }} />
      };
    }
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
              {/* Lifecycle Timeline */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 2, 
                  bgcolor: 'white',
                  border: '1px solid #e2e8f0'
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                  Lifecycle Timeline
                </Typography>
                
                <Box sx={{ position: 'relative', mt: 4, mb: 4, mx: 3 }}>
                  {/* Timeline Track */}
                  <Box sx={{ 
                    height: 6, 
                    bgcolor: '#e2e8f0', 
                    borderRadius: 3,
                    position: 'relative',
                    zIndex: 1
                  }} />
                  
                  {/* Timeline Markers */}
                  <Box sx={{ 
                    position: 'absolute', 
                    left: '0%', 
                    top: -18, 
                    transform: 'translateX(-50%)',
                    zIndex: 2
                  }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                      border: '2px solid white'
                    }}>
                      <Add sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'medium', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      Created
                    </Typography>
                  </Box>
                  
                  {/* Current Status Marker */}
                  <Box sx={{ 
                    position: 'absolute', 
                    left: `${Math.min(Math.max(getLifecyclePercentage(mattress.lifeCyclesEnd), 5), 95)}%`, 
                    top: -18, 
                    transform: 'translateX(-50%)',
                    zIndex: 3
                  }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#008080',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                      border: '2px solid white'
                    }}>
                      <KingBed sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'medium', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      Current
                    </Typography>
                  </Box>
                  
                  {/* End of Life Marker */}
                  <Box sx={{ 
                    position: 'absolute', 
                    left: '100%', 
                    top: -18, 
                    transform: 'translateX(-50%)',
                    zIndex: 2
                  }}>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                      border: '2px solid white'
                    }}>
                      <EventAvailable sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'medium', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      End of Life
                    </Typography>
                  </Box>
                  
                  {/* Progress Bar */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: 6,
                    width: `${Math.min(getLifecyclePercentage(mattress.lifeCyclesEnd), 100)}%`,
                    bgcolor: '#008080',
                    borderRadius: 3,
                    zIndex: 1,
                    backgroundImage: 'linear-gradient(90deg, #10b981, #008080, #ef4444)'
                  }} />
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 4,
                  px: 1,
                  py: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0'
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Production Date</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattress.productionDate ? formatDate(mattress.productionDate) : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Current Status</Typography>
                    <Chip 
                      label={MattressService.getStatusString(mattress.status)} 
                      size="small" 
                      color={MattressService.getStatusColor(mattress.status)}
                      sx={{ fontWeight: 600, mt: 0.5 }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>End of Life Date</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(mattress.lifeCyclesEnd)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getLifecyclePercentage(mattress.lifeCyclesEnd) > 75 ? '#ef4444' : 
                              getLifecyclePercentage(mattress.lifeCyclesEnd) > 50 ? '#f59e0b' : '#10b981',
                      mr: 1
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      {getDaysRemaining(mattress.lifeCyclesEnd)} days remaining
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold" color={
                    getLifecyclePercentage(mattress.lifeCyclesEnd) > 75 ? '#ef4444' : 
                    getLifecyclePercentage(mattress.lifeCyclesEnd) > 50 ? '#f59e0b' : '#10b981'
                  }>
                    {Math.round(getLifecyclePercentage(mattress.lifeCyclesEnd))}% used
                  </Typography>
                </Box>
              </Paper>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="#1e293b">
                    Mattress History
                  </Typography>
                  <Chip 
                    label={`${getFilteredLogs().length} events`} 
                    size="small" 
                    sx={{ 
                      ml: 2, 
                      bgcolor: 'rgba(0,128,128,0.1)', 
                      color: '#008080',
                      fontWeight: 500
                    }} 
                  />
                </Box>

                {/* Filter Control */}
                <FormControl 
                  size="small" 
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008080',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008080',
                      }
                    }
                  }}
                >
                  <InputLabel>Filter by Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Filter by Type"
                    onChange={handleFilterChange}
                    startAdornment={
                      <FilterList sx={{ color: '#64748b', mr: 1 }} />
                    }
                  >
                    <MenuItem value="all">All Events</MenuItem>
                    <MenuItem value="created">Creation Events</MenuItem>
                    <MenuItem value="status">Status Changes</MenuItem>
                    <MenuItem value="location">Location Changes</MenuItem>
                    <MenuItem value="rotation">Rotation Events</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Loading State for Logs */}
              {logsLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#008080', mr: 2 }} />
                  <Typography variant="body1" color="text.secondary">Loading history...</Typography>
                </Box>
              )}
              
              {/* Error State for Logs */}
              {logsError && !logsLoading && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Warning sx={{ fontSize: 40, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" color="error" gutterBottom>
                    Error Loading History
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {logsError}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => setTabValue(0)}
                  >
                    Back to Details
                  </Button>
                </Box>
              )}
              
              {/* Logs List with Pagination */}
              {!logsLoading && !logsError && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    bgcolor: 'white',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {mattressLogs && mattressLogs.length > 0 ? (
                    <>
                      <List sx={{ p: 0 }}>
                        {getPaginatedLogs().map((log, index) => {
                          const logInfo = parseLogDetails(log);
                          return (
                            <React.Fragment key={log.id}>
                              <ListItem 
                                sx={{ 
                                  py: 3,
                                  px: 3,
                                  '&:hover': {
                                    bgcolor: 'rgba(0,128,128,0.04)'
                                  },
                                  position: 'relative',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {/* Timeline connector */}
                                {index < getPaginatedLogs().length - 1 && (
                                  <Box sx={{ 
                                    position: 'absolute',
                                    left: 28,
                                    top: 48,
                                    bottom: 0,
                                    width: 2,
                                    bgcolor: '#e2e8f0',
                                    zIndex: 1
                                  }} />
                                )}
                                
                                <ListItemIcon>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: logInfo.action === 'Creation' ? '#10b981' : 
                                             logInfo.action === 'Status Change' ? '#6366f1' : 
                                             logInfo.action === 'Location Change' ? '#8b5cf6' : '#008080',
                                      width: 40,
                                      height: 40,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      zIndex: 2
                                    }}
                                  >
                                    {logInfo.icon}
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="body1" fontWeight="bold" color="#1e293b">
                                        {logInfo.action}
                                      </Typography>
                                      <Chip 
                                        label={logInfo.timestamp} 
                                        size="small"
                                        sx={{ 
                                          bgcolor: 'rgba(0,128,128,0.1)', 
                                          color: '#008080',
                                          fontWeight: 500,
                                          fontSize: '0.75rem'
                                        }}
                                      />
                                    </Box>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 1 }}>
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                          lineHeight: 1.6,
                                          p: 1.5,
                                          bgcolor: '#f8fafc',
                                          borderRadius: 1,
                                          border: '1px solid #e2e8f0',
                                          mt: 1
                                        }}
                                      >
                                        {logInfo.description}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                              {index < getPaginatedLogs().length - 1 && <Divider />}
                            </React.Fragment>
                          );
                        })}
                      </List>

                      {/* Pagination Controls */}
                      <Box sx={{ 
                        py: 2,
                        px: 3,
                        borderTop: '1px solid #e2e8f0',
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              fontWeight: 500
                            }}
                          >
                            <InfoIcon sx={{ fontSize: 16, mr: 0.5, color: '#008080' }} />
                            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, getFilteredLogs().length)} of {getFilteredLogs().length} events
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FormControl 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                              mr: 2, 
                              minWidth: 80,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'white',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#008080',
                                },
                              }
                            }}
                          >
                            <Select
                              value={rowsPerPage}
                              onChange={handleChangeRowsPerPage}
                              sx={{ 
                                height: 36,
                                fontSize: '0.875rem',
                                color: '#475569',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#008080',
                                }
                              }}
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                            </Select>
                          </FormControl>
                          
                          <Pagination 
                            count={Math.ceil(getFilteredLogs().length / rowsPerPage)}
                            page={page + 1}
                            onChange={(e, newPage) => handleChangePage(e, newPage - 1)}
                            shape="rounded"
                            sx={{
                              '& .MuiPaginationItem-root': {
                                color: '#475569',
                                borderRadius: 1,
                                '&.Mui-selected': {
                                  bgcolor: '#008080',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    bgcolor: '#006666',
                                  }
                                },
                                '&:hover': {
                                  bgcolor: 'rgba(0, 128, 128, 0.1)',
                                }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <InfoIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No History Available
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {filterType === 'all' 
                          ? 'This mattress has no recorded history yet.'
                          : 'No events found matching the selected filter.'}
                      </Typography>
                      {filterType !== 'all' && (
                        <Button
                          variant="text"
                          onClick={() => setFilterType('all')}
                          sx={{ mt: 2, color: '#008080' }}
                        >
                          Show All Events
                        </Button>
                      )}
                    </Box>
                  )}
                </Paper>
              )}
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