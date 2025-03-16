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
  LinearProgress
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Edit, 
  Info,
  Close,
  Refresh,
  Category,
  TuneOutlined,
  Add
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';
import CustomSidebar from '../../components/layout/Sidebar';
import MattressTypeDetailDrawer from './MattressTypeDetailDrawer';
import { useNavigate } from 'react-router-dom';

// Sample data for mattress types
const sampleMattressTypes = [
  {
    id: 1,
    name: 'Premium Memory Foam',
    dimensions: '200cm x 180cm x 25cm',
    stock: 42,
    width: 180,
    length: 200,
    height: 25,
    composition: ['Memory Foam (70%)', 'Support Foam (30%)'],
    washable: 'Cover Only',
    rotationInterval: 90,
    recyclingDetails: 'Foam can be recycled at specialized facilities',
    expectedLifespan: '10 years',
    warrantyPeriod: '8 years',
    documents: [
      { name: 'Material Safety Data Sheet', type: 'pdf' },
      { name: 'Warranty Information', type: 'pdf' },
      { name: 'Care Instructions', type: 'pdf' }
    ]
  },
  {
    id: 2,
    name: 'Luxury Hybrid',
    dimensions: '200cm x 160cm x 28cm',
    stock: 18,
    width: 160,
    length: 200,
    height: 28,
    composition: ['Memory Foam (40%)', 'Pocket Springs (50%)', 'Latex (10%)'],
    washable: 'Cover Only',
    rotationInterval: 120,
    recyclingDetails: 'Springs can be recycled as metal. Foam requires specialized recycling.',
    expectedLifespan: '12 years',
    warrantyPeriod: '10 years',
    documents: [
      { name: 'Material Safety Data Sheet', type: 'pdf' },
      { name: 'Warranty Information', type: 'pdf' },
      { name: 'Environmental Impact Assessment', type: 'pdf' }
    ]
  },
  {
    id: 3,
    name: 'Eco-Friendly Latex',
    dimensions: '200cm x 90cm x 22cm',
    stock: 27,
    width: 90,
    length: 200,
    height: 22,
    composition: ['Natural Latex (80%)', 'Organic Cotton (20%)'],
    washable: 'Full Mattress',
    rotationInterval: 180,
    recyclingDetails: 'Fully biodegradable and recyclable materials',
    expectedLifespan: '15 years',
    warrantyPeriod: '12 years',
    documents: [
      { name: 'Organic Certification', type: 'pdf' },
      { name: 'Eco-Friendly Manufacturing Process', type: 'pdf' },
      { name: 'Recycling Instructions', type: 'pdf' }
    ]
  },
  {
    id: 4,
    name: 'Budget Foam',
    dimensions: '190cm x 90cm x 18cm',
    stock: 65,
    width: 90,
    length: 190,
    height: 18,
    composition: ['High-Density Foam (100%)'],
    washable: 'Cover Only',
    rotationInterval: 60,
    recyclingDetails: 'Foam can be repurposed for padding',
    expectedLifespan: '5 years',
    warrantyPeriod: '3 years',
    documents: [
      { name: 'Care Instructions', type: 'pdf' }
    ]
  },
  {
    id: 5,
    name: 'Premium Pocket Spring',
    dimensions: '200cm x 180cm x 30cm',
    stock: 12,
    width: 180,
    length: 200,
    height: 30,
    composition: ['Pocket Springs (70%)', 'Wool (15%)', 'Cotton (15%)'],
    washable: 'Cover Only',
    rotationInterval: 90,
    recyclingDetails: 'Springs recyclable as metal. Natural fibers biodegradable.',
    expectedLifespan: '10 years',
    warrantyPeriod: '7 years',
    documents: [
      { name: 'Material Safety Data Sheet', type: 'pdf' },
      { name: 'Spring Configuration Details', type: 'pdf' }
    ]
  },
  {
    id: 6,
    name: 'Orthopedic Support',
    dimensions: '200cm x 160cm x 26cm',
    stock: 31,
    width: 160,
    length: 200,
    height: 26,
    composition: ['High-Density Support Foam (60%)', 'Memory Foam (40%)'],
    washable: 'Cover Only',
    rotationInterval: 120,
    recyclingDetails: 'Foam requires specialized recycling facilities',
    expectedLifespan: '8 years',
    warrantyPeriod: '5 years',
    documents: [
      { name: 'Orthopedic Certification', type: 'pdf' },
      { name: 'Pressure Relief Testing Results', type: 'pdf' }
    ]
  },
  {
    id: 7,
    name: 'Cooling Gel Memory Foam',
    dimensions: '200cm x 140cm x 24cm',
    stock: 22,
    width: 140,
    length: 200,
    height: 24,
    composition: ['Gel-Infused Memory Foam (50%)', 'Support Foam (50%)'],
    washable: 'Cover Only',
    rotationInterval: 90,
    recyclingDetails: 'Foam can be recycled at specialized facilities',
    expectedLifespan: '9 years',
    warrantyPeriod: '7 years',
    documents: [
      { name: 'Cooling Technology Specifications', type: 'pdf' },
      { name: 'Temperature Regulation Test Results', type: 'pdf' }
    ]
  },
  {
    id: 8,
    name: 'Kids Waterproof',
    dimensions: '180cm x 90cm x 15cm',
    stock: 48,
    width: 90,
    length: 180,
    height: 15,
    composition: ['Hypoallergenic Foam (90%)', 'Waterproof Cover (10%)'],
    washable: 'Full Mattress',
    rotationInterval: 60,
    recyclingDetails: 'Cover can be separated for specialized recycling',
    expectedLifespan: '6 years',
    warrantyPeriod: '5 years',
    documents: [
      { name: 'Hypoallergenic Certification', type: 'pdf' },
      { name: 'Waterproof Testing Results', type: 'pdf' }
    ]
  }
];

const MattressTypePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [filteredMattressTypes, setFilteredMattressTypes] = useState(sampleMattressTypes);
  const [selectedMattressType, setSelectedMattressType] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Drawer handlers
  const handleOpenDrawer = (mattressType) => {
    setSelectedMattressType(mattressType);
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

  // Navigate to create DPP page
  const handleCreateDPP = () => {
    navigate('/mattress-types/create-dpp');
  };

  // Simulate loading when filters change
  const handleFilterChange = (type, value) => {
    setIsLoading(true);
    
    if (type === 'size') {
      setSizeFilter(value);
    } else if (type === 'stock') {
      setStockFilter(value);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Filter mattress types based on search term and filters
  useEffect(() => {
    let result = sampleMattressTypes;
    
    // Filter by tab (Yours or All)
    if (tabValue === 0) {
      // "Yours" tab - could filter by user's organization in a real app
      result = sampleMattressTypes.filter((_, index) => index < 5); // Just a sample filter
    }
    
    // Apply search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(mattressType => 
        mattressType.name.toLowerCase().includes(lowercasedSearch) ||
        mattressType.dimensions.toLowerCase().includes(lowercasedSearch) ||
        mattressType.composition.some(comp => comp.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Apply size filter
    if (sizeFilter !== 'all') {
      result = result.filter(mattressType => {
        if (sizeFilter === 'single') return mattressType.width <= 100;
        if (sizeFilter === 'double') return mattressType.width > 100 && mattressType.width <= 150;
        if (sizeFilter === 'queen') return mattressType.width > 150 && mattressType.width <= 170;
        if (sizeFilter === 'king') return mattressType.width > 170;
        return true;
      });
    }
    
    // Apply stock filter
    if (stockFilter !== 'all') {
      result = result.filter(mattressType => {
        if (stockFilter === 'low') return mattressType.stock < 20;
        if (stockFilter === 'medium') return mattressType.stock >= 20 && mattressType.stock < 50;
        if (stockFilter === 'high') return mattressType.stock >= 50;
        return true;
      });
    }
    
    setFilteredMattressTypes(result);
  }, [tabValue, searchTerm, sizeFilter, stockFilter]);

  // Get stock level color
  const getStockColor = (stock) => {
    if (stock < 20) return 'error';
    if (stock < 50) return 'warning';
    return 'success';
  };

  // Search Dialog for mobile
  const SearchDialog = ({ open, onClose }) => {
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [localSizeFilter, setLocalSizeFilter] = useState(sizeFilter);
    const [localStockFilter, setLocalStockFilter] = useState(stockFilter);

    const handleApplyFilters = () => {
      setSearchTerm(localSearch);
      setSizeFilter(localSizeFilter);
      setStockFilter(localStockFilter);
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
            placeholder="Search mattress types..."
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
            <InputLabel>Size</InputLabel>
            <Select
              value={localSizeFilter}
              label="Size"
              onChange={(e) => setLocalSizeFilter(e.target.value)}
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
              <MenuItem value="all">All Sizes</MenuItem>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="queen">Queen</MenuItem>
              <MenuItem value="king">King</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Stock Level</InputLabel>
            <Select
              value={localStockFilter}
              label="Stock Level"
              onChange={(e) => setLocalStockFilter(e.target.value)}
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
              <MenuItem value="all">All Stock Levels</MenuItem>
              <MenuItem value="low">Low Stock (&lt;20)</MenuItem>
              <MenuItem value="medium">Medium Stock (20-49)</MenuItem>
              <MenuItem value="high">High Stock (50+)</MenuItem>
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
              setLocalSizeFilter('all');
              setLocalStockFilter('all');
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
        {/* Page Header with Create Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1e293b',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Mattress Types
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateDPP}
            sx={{
              bgcolor: '#008080',
              '&:hover': {
                bgcolor: '#006666',
              },
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,128,128,0.2)',
              textTransform: 'none',
              px: 3
            }}
          >
            Create DPP/Type
          </Button>
        </Box>

        {/* Tabs centered horizontally */}
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
              '& .MuiTabs-indicator': {
                backgroundColor: '#008080',
                height: 3
              }
            }}
          >
            <Tab label="Yours" />
            <Tab label="All" />
          </Tabs>
        </Box>

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
                placeholder="Search mattress types..."
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
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={sizeFilter}
                    label="Size"
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1, mr: -0.5 }}>
                        <Category fontSize="small" sx={{ color: '#64748b' }} />
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
                    <MenuItem value="all">All Sizes</MenuItem>
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="queen">Queen</MenuItem>
                    <MenuItem value="king">King</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Stock Level</InputLabel>
                  <Select
                    value={stockFilter}
                    label="Stock Level"
                    onChange={(e) => handleFilterChange('stock', e.target.value)}
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
                    <MenuItem value="all">All Stock Levels</MenuItem>
                    <MenuItem value="low">Low Stock (&lt;20)</MenuItem>
                    <MenuItem value="medium">Medium Stock (20-49)</MenuItem>
                    <MenuItem value="high">High Stock (50+)</MenuItem>
                  </Select>
                </FormControl>
                
                <IconButton 
                  onClick={() => {
                    setSizeFilter('all');
                    setStockFilter('all');
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
                <Box sx={{ flex: 1, textAlign: 'left' }}>Search mattress types...</Box>
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
            Showing {filteredMattressTypes.length} mattress types
          </Typography>
        </Box>

        {/* Mattress Type Cards Grid */}
        <Grid container spacing={3}>
          {filteredMattressTypes.length > 0 ? (
            filteredMattressTypes.map((mattressType) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={mattressType.id}>
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
                  {/* Card Header with Stock Level */}
                  <Box sx={{ 
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    bgcolor: '#f8fafc'
                  }}>
                    <Chip 
                      label={`Stock: ${mattressType.stock}`} 
                      size="small" 
                      color={getStockColor(mattressType.stock)}
                      sx={{ fontWeight: 600 }}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenDrawer(mattressType)}
                      sx={{ 
                        color: '#64748b',
                        '&:hover': { color: '#008080' }
                      }}
                    >
                      <Info fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Card Content - Name and Dimensions */}
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
                        <Category />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                          {mattressType.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mattressType.dimensions}
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
                  <Category sx={{ fontSize: 60, color: '#94a3b8' }} />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No mattress types found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                  We couldn't find any mattress types matching your search criteria. Try adjusting your filters or search term.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />}
                  onClick={() => {
                    setSizeFilter('all');
                    setStockFilter('all');
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
      </Box>

      {/* Mattress Type Detail Drawer */}
      <MattressTypeDetailDrawer 
        open={drawerOpen}
        onClose={handleCloseDrawer}
        mattressType={selectedMattressType}
      />

      {/* Search Dialog for Mobile */}
      <SearchDialog 
        open={showSearchDialog}
        onClose={handleCloseSearchDialog}
      />
    </>
  );
};

export default MattressTypePage;