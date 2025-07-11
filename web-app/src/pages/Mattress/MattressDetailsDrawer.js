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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
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
  NavigateBefore,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';
import MattressService from '../../services/MattressService';
import { useAuth } from '../../context/AuthContext';
import MattressLifecycleTimeline from '../../components/MattressLifecycleTimeline';
import CustomSnackbar from '../../components/Snackbar';

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

// EditMattressDialog component
const EditMattressDialog = ({ open, onClose, mattress, onSave }) => {
  const [status, setStatus] = useState(mattress ? mattress.status : 0);
  const [location, setLocation] = useState(mattress ? mattress.location : '');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update state when mattress prop changes
  useEffect(() => {
    if (mattress) {
      setStatus(mattress.status);
      setLocation(mattress.location);
      setHasChanges(false);
    }
  }, [mattress]);

  // Check if any changes were made
  useEffect(() => {
    if (mattress) {
      setHasChanges(
        status !== mattress.status || 
        location !== mattress.location
      );
    }
  }, [status, location, mattress]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      await onSave({
        Status: status,
        location: location
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving mattress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status color for the status chip
  const getStatusColor = (statusCode) => {
    const colorMap = {
      0: '#0ea5e9', // info - In Production
      1: '#64748b', // info - In Inventory
      2: '#10b981', // success - Assigned
      3: '#10b981', // success - In Use
      4: '#f59e0b', // warning - Needs Cleaning
      5: '#ef4444', // error - Decommissioned
      6: '#0ea5e9', // info - In Transit
      7: '#f59e0b'  // warning - Rotation Needed
    };
    
    return colorMap[statusCode] || '#64748b';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#008080', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Edit sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight="bold">
            Edit Mattress Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 1, px: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update the mattress status and location below. These changes will be reflected in the mattress history.
          </Typography>
          
          <Paper elevation={0} sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'rgba(0, 128, 128, 0.05)', 
            border: '1px solid rgba(0, 128, 128, 0.1)',
            borderRadius: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ color: '#008080', mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                You are editing <strong>{mattress?.type || 'Mattress'}</strong> with ID: <strong>{mattress?.id || 'Unknown'}</strong>
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
              Mattress Status
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={handleStatusChange}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: status !== mattress?.status ? 'rgba(0, 128, 128, 0.5)' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: status !== mattress?.status ? 'rgba(0, 128, 128, 0.8)' : 'rgba(0, 0, 0, 0.23)'
                  }
                }}
              >
                <MenuItem value={0}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(0),
                      mr: 1.5
                    }} />
                    In Production
                  </Box>
                </MenuItem>
                <MenuItem value={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(1),
                      mr: 1.5
                    }} />
                    In Inventory
                  </Box>
                </MenuItem>
                <MenuItem value={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(2),
                      mr: 1.5
                    }} />
                    Assigned
                  </Box>
                </MenuItem>
                <MenuItem value={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(3),
                      mr: 1.5
                    }} />
                    In Use
                  </Box>
                </MenuItem>
                <MenuItem value={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(4),
                      mr: 1.5
                    }} />
                    Needs Cleaning
                  </Box>
                </MenuItem>
                <MenuItem value={5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(5),
                      mr: 1.5
                    }} />
                    Decommissioned
                  </Box>
                </MenuItem>
                <MenuItem value={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(6),
                      mr: 1.5
                    }} />
                    In Transit
                  </Box>
                </MenuItem>
                <MenuItem value={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(7),
                      mr: 1.5
                    }} />
                    Rotation Needed
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            {status !== mattress?.status && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <SwapHoriz sx={{ color: '#6366f1', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="#6366f1">
                  Changing from {MattressService.getStatusString(mattress?.status)} to {MattressService.getStatusString(status)}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
              Mattress Location
            </Typography>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={handleLocationChange}
              disabled={loading}
              placeholder="Enter the current location of the mattress"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: location !== mattress?.location ? 'rgba(0, 128, 128, 0.5)' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: location !== mattress?.location ? 'rgba(0, 128, 128, 0.8)' : 'rgba(0, 0, 0, 0.23)'
                  }
                }
              }}
            />
            
            {location !== mattress?.location && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <Place sx={{ color: '#8b5cf6', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="#8b5cf6">
                  Changing from "{mattress?.location}" to "{location}"
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={loading}
          sx={{ 
            fontWeight: 500,
            textTransform: 'none',
            px: 2
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading || !hasChanges}
          sx={{ 
            bgcolor: '#008080',
            '&:hover': {
              bgcolor: '#006666',
            },
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MattressDetailDrawer = ({ open, onClose, mattress, onUpdate }) => {
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { token } = useAuth();

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      // Reset to initial state when drawer closes
      setTabValue(0);
      setDetailedMattress(null);
      setError(null);
      setMattressLogs([]);
      setLogsError(null);
      setPage(0);
      setFilterType('all');
      // Don't reset rowsPerPage as it's calculated based on screen size
    }
  }, [open]);

  // Handle drawer close with state reset
  const handleDrawerClose = () => {
    onClose();
  };

  // Open edit dialog
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    // Refresh mattress data when dialog closes
    fetchMattressDetails();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch detailed mattress data when drawer opens
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

  // Fetch detailed mattress data when drawer opens
  useEffect(() => {
    fetchMattressDetails();
  }, [mattress, open, editDialogOpen]);

  // Handle save mattress changes
  const handleSaveMattress = async (mattressData) => {
    try {
      const response = await MattressService.updateMattress(mattress.id, mattressData);
      
      if (response.success) {
        // Refresh the detailed mattress data
        fetchMattressDetails();
        
        // Also update the main mattress object to ensure UI consistency
        const updatedMattress = {
          ...mattress,
          status: mattressData.Status,
          location: mattressData.location
        };
        
        // Update the local mattress reference to ensure the drawer shows updated data
        Object.assign(mattress, {
          status: mattressData.Status,
          location: mattressData.location
        });
        
        // Notify parent component about the update if onUpdate prop exists
        if (onUpdate && typeof onUpdate === 'function') {
          // Pass the updated mattress to the parent
          onUpdate(updatedMattress);
        }
        
        // Show success message
        setSnackbar({
          open: true,
          message: 'Mattress updated successfully',
          severity: 'success'
        });
        
        // Refresh mattress logs if we're on the history tab
        if (tabValue === 1) {
          fetchMattressLogs();
        }
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update mattress');
      }
    } catch (error) {
      console.error('Error updating mattress:', error);
      
      // Show error message
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update mattress',
        severity: 'error'
      });
      
      throw error;
    }
  };

  // Fetch mattress logs function (extracted for reuse)
    const fetchMattressLogs = async () => {
      if (mattress && open && tabValue === 1) {
        setLogsLoading(true);
        setLogsError(null);
        try {
          const response = await MattressService.getMattressLogs(mattress.id);
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

  // Fetch mattress logs when drawer opens and tab changes to History
  useEffect(() => {
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
      try {
        const details = JSON.parse(log.details);
        
        switch (filterType) {
          case 'created':
            return details.Detail === 'New Mattress Created';
          case 'status':
            return details.Detail === 'Updated Mattress Status';
          case 'location':
            return details.Detail === 'Updated Mattress Location';
          case 'rotation':
            return details.Detail === 'Mattress Rotated' || 
                  (details.Detail && details.Detail.toLowerCase().includes('rotation'));
          default:
            return details.Detail.toLowerCase().includes(filterType.toLowerCase());
        }
      } catch (error) {
        return false;
      }
    });
  };

  // Get paginated logs
  const getPaginatedLogs = () => {
    const filteredLogs = getFilteredLogs();
    return filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  // Calculate optimal number of items to display based on screen height
  const calculateOptimalRowsPerPage = () => {
    // Approximate height of each history item in pixels
    const itemHeight = 100; // Average height of a history card
    
    // Approximate height of other UI elements in the drawer
    const headerHeight = 65; // Header bar
    const tabsHeight = 48; // Tabs bar
    const timelineHeight = 150; // Lifecycle timeline component
    const historyHeaderHeight = 60; // History section header with filter
    const paginationHeight = 60; // Pagination controls
    
    // Calculate available height for history items
    const totalNonItemHeight = headerHeight + tabsHeight + timelineHeight + historyHeaderHeight + paginationHeight;
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - totalNonItemHeight;
    
    // Calculate how many items can fit
    const optimalItems = Math.max(1, Math.floor(availableHeight / itemHeight));
    
    // Return a standard number (5, 10, 15, etc.) closest to but not exceeding the optimal count
    if (optimalItems <= 5) return 5;
    if (optimalItems <= 10) return 10;
    if (optimalItems <= 15) return 15;
    if (optimalItems <= 20) return 20;
    return 25;
  };

  // Update rows per page when drawer opens or window resizes
  useEffect(() => {
    if (open && tabValue === 1) {
      const handleResize = () => {
        setRowsPerPage(calculateOptimalRowsPerPage());
      };
      
      // Set initial optimal rows per page
      handleResize();
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [open, tabValue]);

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
      
      if (details.Detail === 'New Mattress Created') {
        action = 'Creation';
        if (details.result) {
          const mattressInfo = details.result;
          description = `New mattress created: ${mattressInfo.MattressTypeName} at location "${mattressInfo.location}"`;
        } else {
          description = 'New mattress created';
        }
      } 
      else if (details.Detail === 'Updated Mattress Status') {
        action = 'Status Change';
        const originalStatus = MattressService.getStatusString(parseInt(details.Original));
        const newStatus = MattressService.getStatusString(parseInt(details.New));
        description = `Status changed from "${originalStatus}" to "${newStatus}"`;
      }
      else if (details.Detail === 'Updated Mattress Location') {
        action = 'Location Change';
        description = `Location changed from "${details.Original}" to "${details.New}"`;
      }
      else if (details.Detail === 'Mattress Rotated' || details.Detail.toLowerCase().includes('rotation')) {
        action = 'Rotation';
        description = `Mattress rotation performed`;
        if (details.Notes) {
          description += `: ${details.Notes}`;
        }
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
        timestamp: `${formattedDate} at ${formattedTime}`
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
              timestamp: `${formattedDate} at ${formattedTime}`
            };
          }
        }
      } catch (dateError) {
        console.error('Error parsing timestamp:', dateError);
      }
      
      return {
        action: 'Update',
        description: 'Log details unavailable',
        timestamp: logItem.timeStamp || 'Unknown date'
      };
    }
  };

  if (!mattress) return null;

  return (
    <>
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500, md: 700 },
          maxWidth: '100%',
          bgcolor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Sticky Drawer Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#008080',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'white', mr: 2 }}>
            <KingBed sx={{ color: '#008080' }} />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {mattress.type} Mattress Details
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Tabs - Also sticky */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        bgcolor: 'white',
        position: 'sticky',
        top: 65, // Height of the header
        zIndex: 1000,
      }}>
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

      {/* Scrollable Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
      }}>
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
              onClick={handleDrawerClose}
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
                        label={MattressService.getStatusString(detailedMattress ? detailedMattress.status : mattress.status)} 
                      size="small" 
                        color={MattressService.getStatusColor(detailedMattress ? detailedMattress.status : mattress.status)}
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
                            <Typography variant="body1" fontWeight="medium">{detailedMattress ? detailedMattress.location : mattress.location}</Typography>
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
                          value={getLifecyclePercentage(detailedMattress ? detailedMattress.lifeCyclesEnd : mattress.lifeCyclesEnd)}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          mb: 1,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                              bgcolor: getLifecyclePercentage(detailedMattress ? detailedMattress.lifeCyclesEnd : mattress.lifeCyclesEnd) > 75 ? '#ef4444' : 
                                    getLifecyclePercentage(detailedMattress ? detailedMattress.lifeCyclesEnd : mattress.lifeCyclesEnd) > 50 ? '#f59e0b' : '#10b981'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            {getDaysRemaining(detailedMattress ? detailedMattress.lifeCyclesEnd : mattress.lifeCyclesEnd)} days remaining
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(getLifecyclePercentage(detailedMattress ? detailedMattress.lifeCyclesEnd : mattress.lifeCyclesEnd))}% used
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<Edit />}
                          onClick={handleOpenEditDialog}
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
                {/* Lifecycle Timeline Component */}
                <MattressLifecycleTimeline 
                    mattress={detailedMattress || mattress}
                  formatDate={formatDate}
                  getLifecyclePercentage={getLifecyclePercentage}
                  getDaysRemaining={getDaysRemaining}
                />

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
                      onClick={handleDrawerClose}
                    >
                      Back to Details
                    </Button>
                  </Box>
                )}
                
                {/* Simplified Logs List with Pagination */}
                {!logsLoading && !logsError && (
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 2, 
                      overflow: 'visible',
                      bgcolor: 'white',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {mattressLogs && mattressLogs.length > 0 ? (
                      <>
                        <Box>
                          <List sx={{ p: 0 }}>
                            {getPaginatedLogs().map((log, index) => {
                              const logInfo = parseLogDetails(log);
                              return (
                                <React.Fragment key={log.id}>
                                  <ListItem 
                                    sx={{ 
                                      py: 2,
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
                                        top: 40,
                                        bottom: 0,
                                        width: 2,
                                        bgcolor: '#e2e8f0',
                                        zIndex: 1
                                      }} />
                                    )}
                                    
                                    <ListItemIcon>
                                      <Box
                                        sx={{ 
                                          width: 36, 
                                          height: 36, 
                                          borderRadius: '50%', 
                                          bgcolor: 'white',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                          border: '1px solid #e2e8f0',
                                          zIndex: 2,
                                          color: logInfo.action === 'Creation' ? '#10b981' : 
                                                 logInfo.action === 'Status Change' ? '#6366f1' : 
                                                 logInfo.action === 'Location Change' ? '#8b5cf6' : '#008080',
                                        }}
                                      >
                                        {logInfo.action === 'Creation' && <Add />}
                                        {logInfo.action === 'Status Change' && <SwapHoriz />}
                                        {logInfo.action === 'Location Change' && <Place />}
                                        {logInfo.action === 'Rotation' && <Autorenew />}
                                        {!['Creation', 'Status Change', 'Location Change', 'Rotation'].includes(logInfo.action) && <History />}
                                      </Box>
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
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                          {logInfo.description}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                  {index < getPaginatedLogs().length - 1 && <Divider />}
                                </React.Fragment>
                              );
                            })}
                          </List>
                        </Box>

                        {/* Fixed Pagination Controls */}
                        <Box sx={{ 
                          py: 2,
                          px: 3,
                          borderTop: '1px solid #e2e8f0',
                          bgcolor: '#f8fafc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
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
      </Box>
    </Drawer>

      {/* Edit Mattress Dialog */}
      <EditMattressDialog 
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        mattress={detailedMattress || mattress}
        onSave={handleSaveMattress}
      />

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default MattressDetailDrawer;