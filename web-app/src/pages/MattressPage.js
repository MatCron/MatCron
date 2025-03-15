import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActionArea,
  Collapse,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Breadcrumbs,
  Link,
  Grid,
  Chip
} from '@mui/material';
import { Search, FilterList, ExpandMore, ExpandLess, Edit, MoreVert } from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import CustomSidebar from '../components/layout/Sidebar';

// Sample data for mattresses
const sampleMattresses = [
  {
    id: 1,
    type: 'King',
    location: 'Room 101',
    status: 'In production',
    organization: 'Grand Hotel',
    endOfLifeDate: '2025-12-31'
  },
  {
    id: 2,
    type: 'Queen',
    location: 'Room 203',
    status: 'In production',
    organization: 'Luxury Suites',
    endOfLifeDate: '2024-10-15'
  },
  {
    id: 3,
    type: 'Single',
    location: 'Storage A',
    status: 'Transferred out',
    organization: 'Budget Inn',
    endOfLifeDate: '2023-08-22'
  },
  {
    id: 4,
    type: 'King',
    location: 'Room 305',
    status: 'In production',
    organization: 'Grand Hotel',
    endOfLifeDate: '2026-02-18'
  },
  {
    id: 5,
    type: 'Queen',
    location: 'Storage B',
    status: 'Transferred out',
    organization: 'Luxury Suites',
    endOfLifeDate: '2023-11-30'
  }
];

const MattressPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mattresses, setMattresses] = useState(sampleMattresses);
  const [filteredMattresses, setFilteredMattresses] = useState(sampleMattresses);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle card expansion
  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter mattresses based on search term and filters
  useEffect(() => {
    let result = mattresses;
    
    // Filter by tab (Yours or All)
    if (tabValue === 0) {
      // "Yours" tab - could filter by user's organization in a real app
      result = mattresses.filter(mattress => mattress.organization === 'Grand Hotel');
    }
    
    // Apply search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(mattress => 
        mattress.type.toLowerCase().includes(lowercasedSearch) ||
        mattress.location.toLowerCase().includes(lowercasedSearch) ||
        mattress.organization.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(mattress => mattress.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(mattress => mattress.status === statusFilter);
    }
    
    setFilteredMattresses(result);
  }, [tabValue, searchTerm, typeFilter, statusFilter, mattresses]);

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

  return (
    <>
      <Navbar />
      <CustomSidebar />
      
      <Box sx={{ flexGrow: 1, ml: { sm: 30 }, p: 3, mt: 8 }}>
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/dashboard">
            Dashboard
          </Link>
          <Typography color="text.primary">Mattresses</Typography>
        </Breadcrumbs>
        
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="mattress tabs"
          >
            <Tab label="Yours" />
            <Tab label="All" />
          </Tabs>
        </Box>
        
        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search mattresses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                  startAdornment={<FilterList fontSize="small" sx={{ mr: 0.5 }} />}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="King">King</MenuItem>
                  <MenuItem value="Queen">Queen</MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startAdornment={<FilterList fontSize="small" sx={{ mr: 0.5 }} />}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="In production">In production</MenuItem>
                  <MenuItem value="Transferred out">Transferred out</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        
        {/* Mattress Cards */}
        <Box sx={{ mt: 2 }}>
          {filteredMattresses.length > 0 ? (
            filteredMattresses.map((mattress) => (
              <Card 
                key={mattress.id} 
                sx={{ 
                  mb: 2, 
                  borderLeft: '4px solid',
                  borderLeftColor: mattress.status === 'In production' ? 'success.main' : 'error.main',
                }}
              >
                <CardActionArea onClick={() => handleExpandClick(mattress.id)}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {mattress.type} Mattress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {mattress.location}
                      </Typography>
                      <Chip 
                        label={mattress.status} 
                        size="small" 
                        color={getStatusColor(mattress.status)} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {expandedId === mattress.id ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  </CardContent>
                </CardActionArea>
                
                <Collapse in={expandedId === mattress.id} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Organization:</strong> {mattress.organization}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>End of Life Date:</strong> {new Date(mattress.endOfLifeDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button 
                          startIcon={<Edit />} 
                          variant="outlined" 
                          size="small" 
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button 
                          startIcon={<MoreVert />} 
                          variant="outlined" 
                          size="small"
                        >
                          More
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No mattresses found matching your criteria
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MattressPage; 