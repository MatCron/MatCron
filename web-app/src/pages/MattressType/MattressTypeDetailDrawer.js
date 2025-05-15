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
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close,
  Category,
  CheckCircle,
  Info as InfoIcon,
  Description,
  Edit,
  Download,
  Autorenew,
  Wash,
  Recycling,
  Timer,
  VerifiedUser,
  Inventory,
  ErrorOutline
} from '@mui/icons-material';
import MattressTypeService from '../../services/MattressTypeService';

// Sample documents data for when API doesn't return documents
const sampleDocuments = [
  { name: 'Material Safety Data Sheet', type: 'pdf' },
  { name: 'Warranty Information', type: 'pdf' },
  { name: 'Care Instructions', type: 'pdf' },
  { name: 'Recycling Guidelines', type: 'pdf' }
];

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mattress-type-tabpanel-${index}`}
      aria-labelledby={`mattress-type-tab-${index}`}
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

const MattressTypeDetailDrawer = ({ open, onClose, mattressType }) => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailedMattressType, setDetailedMattressType] = useState(null);
  const itemsPerPage = 5;

  // Fetch detailed mattress type data when drawer opens
  useEffect(() => {
    if (open && mattressType && mattressType.id) {
      const fetchDetailedData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await MattressTypeService.getMattressTypeById(mattressType.id);
          if (response.success && response.data) {
            setDetailedMattressType(response.data);
          } else {
            setError('Failed to load detailed mattress type information');
            setDetailedMattressType(mattressType); // Fallback to the basic data
          }
        } catch (err) {
          console.error('Error fetching mattress type details:', err);
          setError('Error loading details. Using available information.');
          setDetailedMattressType(mattressType); // Fallback to the basic data
        } finally {
          setLoading(false);
        }
      };

      fetchDetailedData();
    }
  }, [open, mattressType]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Format dimensions for display
  const formatDimensions = (mattressType) => {
    if (mattressType.dimensions) return mattressType.dimensions;
    if (mattressType.width && mattressType.length && mattressType.height) {
      return `${mattressType.width}cm × ${mattressType.length}cm × ${mattressType.height}cm`;
    }
    return 'Dimensions not available';
  };

  // Get washable string
  const getWashableString = (washable) => {
    if (washable === undefined || washable === null) return 'Unknown';
    if (typeof washable === 'boolean' || typeof washable === 'number') {
      return MattressTypeService.getWashableString(washable);
    }
    return washable; // If it's already a string
  };

  // Process composition data to ensure it's in the right format
  const getComposition = (data) => {
    if (!data) return [];
    
    // If composition is a string, try to parse it as JSON
    if (typeof data.composition === 'string') {
      try {
        return JSON.parse(data.composition);
      } catch (e) {
        // If it's not valid JSON, return it as a single item array
        return [data.composition];
      }
    }
    
    // If composition is already an array, return it
    if (Array.isArray(data.composition)) {
      return data.composition;
    }
    
    // If composition exists but is not a string or array, convert to string and return as array
    if (data.composition !== undefined && data.composition !== null) {
      return [String(data.composition)];
    }
    
    return [];
  };

  if (!mattressType) return null;

  // Use detailed data if available, otherwise use the basic data
  const displayData = detailedMattressType || mattressType;
  
  // Get composition data
  const compositionData = getComposition(displayData);
  
  // Use sample documents if no documents are available
  const documents = displayData.documents && displayData.documents.length > 0 
    ? displayData.documents 
    : sampleDocuments;

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
            <Category sx={{ color: '#008080' }} />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {displayData.name} Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#008080' }} />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert 
            severity="warning" 
            icon={<ErrorOutline />}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {!loading && displayData && (
        <>
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
              <Tab label="Basic Information" />
              <Tab label="Technical Details" />
              <Tab label="Documents" />
            </Tabs>
          </Box>

          {/* Basic Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                  Basic Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Category sx={{ color: '#64748b', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="body1" fontWeight="medium">{displayData.name}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {displayData.width && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Width</Typography>
                          <Typography variant="body1" fontWeight="medium">{displayData.width} cm</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {displayData.length && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Length</Typography>
                          <Typography variant="body1" fontWeight="medium">{displayData.length} cm</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {displayData.height && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Height</Typography>
                          <Typography variant="body1" fontWeight="medium">{displayData.height} cm</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {compositionData.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <InfoIcon sx={{ color: '#64748b', mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Composition</Typography>
                          <Box sx={{ mt: 1 }}>
                            {compositionData.map((comp, index) => (
                              <Chip 
                                key={index}
                                label={comp}
                                size="small"
                                sx={{ 
                                  mr: 1, 
                                  mb: 1,
                                  bgcolor: 'rgba(0,128,128,0.1)',
                                  color: '#008080'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {(displayData.washable !== undefined) && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Wash sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Washable</Typography>
                          <Typography variant="body1" fontWeight="medium">{getWashableString(displayData.washable)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {displayData.rotationInterval && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Autorenew sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Rotation Interval</Typography>
                          <Typography variant="body1" fontWeight="medium">{displayData.rotationInterval} days</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                  Lifecycle Information
                </Typography>
                
                <Grid container spacing={2}>
                  {displayData.recyclingDetails && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Recycling sx={{ color: '#64748b', mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Recycling Details</Typography>
                          <Typography variant="body1">{displayData.recyclingDetails}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {displayData.expectedLifespan && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Timer sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Expected Lifespan</Typography>
                          <Typography variant="body1" fontWeight="medium">{displayData.expectedLifespan}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {displayData.warrantyPeriod && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <VerifiedUser sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Warranty Period</Typography>
                          <Typography variant="body1" fontWeight="medium">{displayData.warrantyPeriod}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {(displayData.stock !== undefined) && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Inventory sx={{ color: '#64748b', mr: 1 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                          <Typography 
                            variant="body1" 
                            fontWeight="medium"
                            color={
                              displayData.stock < 20 ? 'error.main' : 
                              displayData.stock < 50 ? 'warning.main' : 
                              'success.main'
                            }
                          >
                            {displayData.stock} units
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                
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

          {/* Technical Details Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                Technical Specifications
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
                        <TableCell>{displayData.name}</TableCell>
                      </TableRow>
                      {displayData.dimensions && (
                        <TableRow>
                          <TableCell>Dimensions</TableCell>
                          <TableCell>{formatDimensions(displayData)}</TableCell>
                        </TableRow>
                      )}
                      {displayData.width && (
                        <TableRow>
                          <TableCell>Width</TableCell>
                          <TableCell>{displayData.width} cm</TableCell>
                        </TableRow>
                      )}
                      {displayData.length && (
                        <TableRow>
                          <TableCell>Length</TableCell>
                          <TableCell>{displayData.length} cm</TableCell>
                        </TableRow>
                      )}
                      {displayData.height && (
                        <TableRow>
                          <TableCell>Height</TableCell>
                          <TableCell>{displayData.height} cm</TableCell>
                        </TableRow>
                      )}
                      {compositionData.length > 0 && (
                        <TableRow>
                          <TableCell>Composition</TableCell>
                          <TableCell>{compositionData.join(', ')}</TableCell>
                        </TableRow>
                      )}
                      {(displayData.washable !== undefined) && (
                        <TableRow>
                          <TableCell>Washable</TableCell>
                          <TableCell>{getWashableString(displayData.washable)}</TableCell>
                        </TableRow>
                      )}
                      {displayData.rotationInterval && (
                        <TableRow>
                          <TableCell>Rotation Interval</TableCell>
                          <TableCell>{displayData.rotationInterval} days</TableCell>
                        </TableRow>
                      )}
                      {displayData.recyclingDetails && (
                        <TableRow>
                          <TableCell>Recycling Details</TableCell>
                          <TableCell>{displayData.recyclingDetails}</TableCell>
                        </TableRow>
                      )}
                      {displayData.expectedLifespan && (
                        <TableRow>
                          <TableCell>Expected Lifespan</TableCell>
                          <TableCell>{displayData.expectedLifespan}</TableCell>
                        </TableRow>
                      )}
                      {displayData.warrantyPeriod && (
                        <TableRow>
                          <TableCell>Warranty Period</TableCell>
                          <TableCell>{displayData.warrantyPeriod}</TableCell>
                        </TableRow>
                      )}
                      {(displayData.stock !== undefined) && (
                        <TableRow>
                          <TableCell>Current Stock</TableCell>
                          <TableCell>{displayData.stock} units</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={1} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: '#008080',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#006666',
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </TabPanel>

          {/* Documents Tab - Always show with sample data if needed */}
          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                Associated Documents
              </Typography>
              
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                  {documents.map((doc, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        sx={{ 
                          py: 2,
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.02)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Description sx={{ color: '#008080' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body1" fontWeight="medium">
                              {doc.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {doc.type && doc.type.toUpperCase ? doc.type.toUpperCase() : 'PDF'} Document
                            </Typography>
                          }
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Download />}
                          sx={{ 
                            borderColor: '#008080',
                            color: '#008080',
                            '&:hover': {
                              borderColor: '#006666',
                              bgcolor: 'rgba(0,128,128,0.04)'
                            }
                          }}
                        >
                          Download
                        </Button>
                      </ListItem>
                      {index < documents.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={Math.ceil(documents.length / itemsPerPage)} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: '#008080',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#006666',
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </TabPanel>
        </>
      )}
    </Drawer>
  );
};

export default MattressTypeDetailDrawer;