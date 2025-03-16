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
  Pagination
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
  Inventory
} from '@mui/icons-material';

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
  const itemsPerPage = 5;

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (!mattressType) return null;

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
            {mattressType.name} Details
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
                    <Typography variant="body1" fontWeight="medium">{mattressType.name}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Width</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.width} cm</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Length</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.length} cm</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Height</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.height} cm</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <InfoIcon sx={{ color: '#64748b', mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Composition</Typography>
                    <Box sx={{ mt: 1 }}>
                      {mattressType.composition.map((comp, index) => (
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
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Wash sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Washable</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.washable}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Autorenew sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Rotation Interval</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.rotationInterval} days</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Lifecycle Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Recycling sx={{ color: '#64748b', mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Recycling Details</Typography>
                    <Typography variant="body1">{mattressType.recyclingDetails}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timer sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Expected Lifespan</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.expectedLifespan}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VerifiedUser sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Warranty Period</Typography>
                    <Typography variant="body1" fontWeight="medium">{mattressType.warrantyPeriod}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ color: '#64748b', mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      color={
                        mattressType.stock < 20 ? 'error.main' : 
                        mattressType.stock < 50 ? 'warning.main' : 
                        'success.main'
                      }
                    >
                      {mattressType.stock} units
                    </Typography>
                  </Box>
                </Box>
              </Grid>
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
                    <TableCell>{mattressType.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dimensions</TableCell>
                    <TableCell>{mattressType.dimensions}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Width</TableCell>
                    <TableCell>{mattressType.width} cm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Length</TableCell>
                    <TableCell>{mattressType.length} cm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Height</TableCell>
                    <TableCell>{mattressType.height} cm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Composition</TableCell>
                    <TableCell>{mattressType.composition.join(', ')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Washable</TableCell>
                    <TableCell>{mattressType.washable}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rotation Interval</TableCell>
                    <TableCell>{mattressType.rotationInterval} days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Recycling Details</TableCell>
                    <TableCell>{mattressType.recyclingDetails}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Expected Lifespan</TableCell>
                    <TableCell>{mattressType.expectedLifespan}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Warranty Period</TableCell>
                    <TableCell>{mattressType.warrantyPeriod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>{mattressType.stock} units</TableCell>
                  </TableRow>
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

      
    </Drawer>
  );
};

export default MattressTypeDetailDrawer;