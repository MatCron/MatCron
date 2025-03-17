import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  InputAdornment,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Edit, 
  MoreVert, 
  KingBed, 
  Info,
  Close,
  Refresh,
  LocationOn,
  TuneOutlined,
  Error as ErrorIcon
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import CustomSidebar from '../components/layout/Sidebar';
import MattressDetailDrawer from './MattressDetailsDrawer';
import MattressService from '../services/MattressService';
import MattressTypeService from '../services/MattressTypeService';
import { useAuth } from '../context/AuthContext';

const MattressPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mattresses, setMattresses] = useState([]);
  const [mattressTypes, setMattressTypes] = useState([]);
  const [filteredMattresses, setFilteredMattresses] = useState([]);
  const [selectedMattress, setSelectedMattress] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useAuth();

  // Fetch mattresses from API
  useEffect(() => {
    const fetchMattresses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await MattressService.getAllMattresses();
        if (response.success && response.data) {
          setMattresses(response.data);
        } else {
          setError('Failed to load mattresses');
        }
      } catch (err) {
        console.error('Error fetching mattresses:', err);
        setError('Error loading mattresses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMattresses();
  }, []);

  // Fetch mattress types from API
  useEffect(() => {
    const fetchMattressTypes = async () => {
      try {
        const response = await MattressTypeService.getAllMattressTypes();
        if (response.success && response.data) {
          setMattressTypes(response.data);
        } else {
          console.error('Failed to load mattress types');
        }
      } catch (err) {
        console.error('Error fetching mattress types:', err);
      }
    };

    fetchMattressTypes();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Drawer handlers
  const handleOpenDrawer = (mattress) => {
    setSelectedMattress(mattress);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Search dialog handlers
  const handleOpenSearchDialog = () => {
    setShowSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setShowSearchDialog(false);
  };

  // Simulate loading when filters change
  const handleFilterChange = (type, value) => {
    setIsLoading(true);
    
    if (type === 'type') {
      setTypeFilter(value);
    } else if (type === 'status') {
      setStatusFilter(value);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Filter mattresses based on search term and filters
  useEffect(() => {
    if (!mattresses.length) {
      setFilteredMattresses([]);
      return;
    }
    
    let result = mattresses;
    
    // Filter by tab (Yours or All)
    // In a real app, "All" might require a different API call or filter
    // For now, we'll just use the same data for both tabs
    
    // Apply search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(mattress => 
        mattress.type.toLowerCase().includes(lowercasedSearch) ||
        mattress.location.toLowerCase().includes(lowercasedSearch) ||
        mattress.organisation.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(mattress => mattress.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const statusCode = parseInt(statusFilter);
      result = result.filter(mattress => mattress.status === statusCode);
    }
    
    setFilteredMattresses(result);
  }, [mattresses, tabValue, searchTerm, typeFilter, statusFilter]);

  // Get unique mattress types for filter dropdown from the mattresses data
  const uniqueMattressTypes = [...new Set(mattresses.map(m => m.type))];

  // Search Dialog for mobile
  const SearchDialog = ({ open, onClose }) => {
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [localTypeFilter, setLocalTypeFilter] = useState(typeFilter);
    const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);

    const handleApplyFilters = () => {
      setSearchTerm(localSearch);
      setTypeFilter(localTypeFilter);
      setStatusFilter(localStatusFilter);
      onClose();
    };

    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Search & Filter</Typography>
          <IconButton 
            onClick={onClose}
            sx={{ color: '#64748b' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#475569', mb: 1 }}>
            Search
          </Typography>
          <TextField
            fullWidth
            placeholder="Search mattresses..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008080',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008080',
                }
              }
            }}
          />
          
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#475569', mb: 1 }}>
            Filters
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={localTypeFilter}
              label="Type"
              onChange={(e) => setLocalTypeFilter(e.target.value)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008080',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008080',
                }
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {mattressTypes.length > 0 ? (
                mattressTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                ))
              ) : (
                uniqueMattressTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={localStatusFilter}
              label="Status"
              onChange={(e) => setLocalStatusFilter(e.target.value)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008080',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008080',
                }
              }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="0">In Production</MenuItem>
              <MenuItem value="1">In Inventory</MenuItem>
              <MenuItem value="2">Assigned</MenuItem>
              <MenuItem value="3">In Use</MenuItem>
              <MenuItem value="4">Needs Cleaning</MenuItem>
              <MenuItem value="5">Decommissioned</MenuItem>
              <MenuItem value="6">In Transit</MenuItem>
              <MenuItem value="7">Rotation Needed</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ 
          p: 3, 
          pt: 2,
          borderTop: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={() => {
              setLocalTypeFilter('all');
              setLocalStatusFilter('all');
              setLocalSearch('');
            }} 
            color="inherit"
            startIcon={<Refresh />}
          >
            Reset
          </Button>
          <Button 
            onClick={handleApplyFilters} 
            variant="contained" 
            sx={{
              bgcolor: '#008080',
              '&:hover': {
                bgcolor: '#006666',
              },
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,128,128,0.2)'
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Dialog>
    );
  };

  return (
    <>
      <Navbar />
      <CustomSidebar />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, md: 3 }, 
        mt: 1, 
        ml: { xs: 2, sm: 4, md: 6, lg: 10 } 
      }}>
        {/* Page Header */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1e293b',
            fontSize: { xs: '1.5rem', md: '2rem' },
            mb: 4
          }}
        >
          Mattresses
        </Typography>

        {/* Tabs centered horizontally
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 4,
          width: '100%'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                minWidth: 100,
                px: 4
              },
              '& .Mui-selected': {
                color: '#008080'
              },
              '& .MuiTabs-indicator': 
              
              
          {
                backgroundColor: '#008080',
                height: 3
              }
            }}
          >
            <Tab label="Yours" />
            <Tab label="All" />
          </Tabs>
        </Box> */}

        {/* Enhanced Search and Filters */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: 4, 
            borderRadius: 2,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Desktop Search - Only visible on large screens */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <TextField
                fullWidth
                placeholder="Search mattresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#008080',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#008080',
                    }
                  }
                }}
              />
            </Grid>
            
            {/* Desktop Filters - Only visible on large screens */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                width: '100%'
              }}>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1, mr: -0.5 }}>
                        <KingBed fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                      bgcolor: 'white',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008080',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008080',
                      }
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {mattressTypes.length > 0 ? (
                      mattressTypes.map((type) => (
                        <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                      ))
                    ) : (
                      uniqueMattressTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>{type}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1, mr: -0.5 }}>
                        <TuneOutlined fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                      bgcolor: 'white',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008080',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008080',
                      }
                    }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="0">In Production</MenuItem>
                    <MenuItem value="1">In Inventory</MenuItem>
                    <MenuItem value="2">Assigned</MenuItem>
                    <MenuItem value="3">In Use</MenuItem>
                    <MenuItem value="4">Needs Cleaning</MenuItem>
                    <MenuItem value="5">Decommissioned</MenuItem>
                    <MenuItem value="6">In Transit</MenuItem>
                    <MenuItem value="7">Rotation Needed</MenuItem>
                  </Select>
                </FormControl>
                
                <IconButton 
                  onClick={() => {
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  sx={{ 
                    bgcolor: 'white',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 128, 128, 0.04)',
                      borderColor: '#008080'
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Grid>
            
            {/* Mobile & Medium Screen Search Button */}
            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
              <Button 
                fullWidth
                variant="outlined"
                startIcon={<Search />}
                endIcon={<FilterList />}
                onClick={handleOpenSearchDialog}
                sx={{ 
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  '&:hover': {
                    borderColor: '#008080',
                    bgcolor: 'rgba(0, 128, 128, 0.04)'
                  }
                }}
              >
                <Box sx={{ flex: 1, textAlign: 'left' }}>Search mattresses...</Box>
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress 
              sx={{ 
                height: 4, 
                borderRadius: 2,
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#008080'
                }
              }} 
            />
          </Box>
        )}
        
        {/* Results Count */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredMattresses.length} mattresses
          </Typography>
        </Box>

        {/* Error State */}
        {error && !isLoading && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              mb: 2
            }}
          >
            <Box sx={{ mb: 2 }}>
              <ErrorIcon sx={{ fontSize: 60, color: '#ef4444' }} />
            </Box>
            <Typography variant="h6" color="error" gutterBottom>
              Error Loading Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ 
                borderColor: '#ef4444',
                color: '#ef4444',
                '&:hover': {
                  borderColor: '#dc2626',
                  bgcolor: 'rgba(239,68,68,0.04)'
                }
              }}
            >
              Retry
            </Button>
          </Paper>
        )}

        {/* Initial Loading State */}
        {isLoading && !filteredMattresses.length && !error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#008080' }} />
          </Box>
        )}

        {/* Simplified Mattress Cards Grid */}
        {!isLoading && !error && (
          <Grid container spacing={3}>
            {filteredMattresses.length > 0 ? (
              filteredMattresses.map((mattress) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={mattress.id}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      transform: 'translateY(-4px)'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Card Header with Status */}
                    <Box sx={{ 
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #e2e8f0',
                      bgcolor: '#f8fafc'
                    }}>
                      <Chip 
                        label={MattressService.getStatusString(mattress.status)} 
                        size="small" 
                        color={MattressService.getStatusColor(mattress.status)}
                        sx={{ fontWeight: 600 }}
                      />
                      <IconButton 
                        size="small"
                        onClick={() => handleOpenDrawer(mattress)}
                        sx={{ 
                          color: '#64748b',
                          '&:hover': { color: '#008080' }
                        }}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Simplified Card Content - Just Type and Location */}
                    <CardContent sx={{ p: 2, flexGrow: 1, bgcolor: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: '#008080',
                            mr: 2,
                            width: 40,
                            height: 40
                          }}
                        >
                          <KingBed />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                            {mattress.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                            {mattress.location}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: '#f8fafc',
                    border: '1px dashed #cbd5e1'
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <KingBed sx={{ fontSize: 60, color: '#94a3b8' }} />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No mattresses found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                    We couldn't find any mattresses matching your search criteria. Try adjusting your filters or search term.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Refresh />}
                    onClick={() => {
                      setTypeFilter('all');
                      setStatusFilter('all');
                      setSearchTerm('');
                    }}
                    sx={{ 
                      borderColor: '#cbd5e1',
                      color: '#64748b',
                      '&:hover': {
                        borderColor: '#008080',
                        bgcolor: 'rgba(0,128,128,0.04)'
                      }
                    }}
                  >
                    Reset Filters
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Mattress Detail Drawer */}
      <MattressDetailDrawer 
        open={drawerOpen}
        onClose={handleCloseDrawer}
        mattress={selectedMattress}
      />

      {/* Search Dialog for Mobile */}
      <SearchDialog 
        open={showSearchDialog}
        onClose={handleCloseSearchDialog}
      />
    </>
  );
};

export default MattressPage;
                  