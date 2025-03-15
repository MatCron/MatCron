// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Grid,
//   Chip,
//   Avatar,
//   IconButton,
//   Paper,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   useMediaQuery,
//   useTheme
// } from '@mui/material';
// import { Search, FilterList, Edit, MoreVert, KingBed, Loop, EventAvailable, Info, Close } from '@mui/icons-material';
// import Navbar from '../components/layout/Navbar';
// import CustomSidebar from '../components/layout/Sidebar';

// // Sample data for mattresses
// const sampleMattresses = [
//   {
//     id: 1,
//     type: 'King',
//     location: 'Room 101',
//     status: 'In production',
//     daysToRotate: 90,
//     lifeCyclesEnd: '2025-12-31',
//     organisation: 'Grand Hotel'
//   },
//   {
//     id: 2,
//     type: 'Queen',
//     location: 'Room 203',
//     status: 'In production',
//     daysToRotate: 60,
//     lifeCyclesEnd: '2024-10-15',
//     organisation: 'Luxury Suites'
//   },
//   {
//     id: 3,
//     type: 'Single',
//     location: 'Storage A',
//     status: 'Transferred out',
//     daysToRotate: 45,
//     lifeCyclesEnd: '2023-08-22',
//     organisation: 'Budget Inn'
//   },
//   {
//     id: 4,
//     type: 'King',
//     location: 'Room 305',
//     status: 'In production',
//     daysToRotate: 90,
//     lifeCyclesEnd: '2026-02-18',
//     organisation: 'Grand Hotel'
//   },
//   {
//     id: 5,
//     type: 'Queen',
//     location: 'Storage B',
//     status: 'Transferred out',
//     daysToRotate: 60,
//     lifeCyclesEnd: '2023-11-30',
//     organisation: 'Luxury Suites'
//   },
//   {
//     id: 6,
//     type: 'Single',
//     location: 'Room 110',
//     status: 'In production',
//     daysToRotate: 45,
//     lifeCyclesEnd: '2024-05-10',
//     organisation: 'Budget Inn'
//   },
//   {
//     id: 7,
//     type: 'King',
//     location: 'Room 401',
//     status: 'In production',
//     daysToRotate: 90,
//     lifeCyclesEnd: '2025-08-15',
//     organisation: 'Grand Hotel'
//   },
//   {
//     id: 8,
//     type: 'Queen',
//     location: 'Room 202',
//     status: 'In production',
//     daysToRotate: 60,
//     lifeCyclesEnd: '2024-12-20',
//     organisation: 'Luxury Suites'
//   }
// ];

// const MattressPage = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [filteredMattresses, setFilteredMattresses] = useState(sampleMattresses);
//   const [selectedMattress, setSelectedMattress] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Filter mattresses based on search term and filters
//   useEffect(() => {
//     let result = sampleMattresses;
    
//     // Filter by tab (Yours or All)
//     if (tabValue === 0) {
//       // "Yours" tab - could filter by user's organization in a real app
//       result = sampleMattresses.filter(mattress => mattress.organisation === 'Grand Hotel');
//     }
    
//     // Apply search term
//     if (searchTerm) {
//       const lowercasedSearch = searchTerm.toLowerCase();
//       result = result.filter(mattress => 
//         mattress.type.toLowerCase().includes(lowercasedSearch) ||
//         mattress.location.toLowerCase().includes(lowercasedSearch) ||
//         mattress.organisation.toLowerCase().includes(lowercasedSearch)
//       );
//     }
    
//     // Apply type filter
//     if (typeFilter !== 'all') {
//       result = result.filter(mattress => mattress.type === typeFilter);
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'all') {
//       result = result.filter(mattress => mattress.status === statusFilter);
//     }
    
//     setFilteredMattresses(result);
//   }, [tabValue, searchTerm, typeFilter, statusFilter]);

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'In production':
//         return 'success';
//       case 'Transferred out':
//         return 'error';
//       default:
//         return 'default';
//     }
//   };

//   // Get mattress icon color based on type
//   const getMattressColor = (type) => {
//     switch (type) {
//       case 'King':
//         return '#8a2be2'; // Purple for King
//       case 'Queen':
//         return '#1e90ff'; // Blue for Queen
//       case 'Single':
//         return '#20b2aa'; // Teal for Single
//       default:
//         return '#607d8b'; // Gray for others
//     }
//   };

//   // Calculate days remaining until lifecycle end
//   const getDaysRemaining = (endDate) => {
//     const today = new Date();
//     const end = new Date(endDate);
//     const diffTime = end - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   };

//   // Dialog handlers
//   const handleOpenDialog = (mattress) => {
//     setSelectedMattress(mattress);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedMattress(null);
//   };

//   // Detailed Info Dialog
//   const DetailDialog = ({ mattress, open, onClose }) => {
//     if (!mattress) return null;
    
//     return (
//       <Dialog 
//         open={open} 
//         onClose={onClose}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center',
//           bgcolor: getMattressColor(mattress.type) + '20'
//         }}>
//           <Typography variant="h6">
//             Mattress Details
//           </Typography>
//           <IconButton onClick={onClose} size="small">
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ mt: 2 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Typography variant="subtitle2" color="text.secondary">Type</Typography>
//               <Typography variant="body1" fontWeight="medium">{mattress.type}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle2" color="text.secondary">Location</Typography>
//               <Typography variant="body1" fontWeight="medium">{mattress.location}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle2" color="text.secondary">Status</Typography>
//               <Chip 
//                 label={mattress.status} 
//                 size="small" 
//                 color={getStatusColor(mattress.status)}
//                 sx={{ mt: 0.5 }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle2" color="text.secondary">Days to Rotate</Typography>
//               <Typography variant="body1" fontWeight="medium">{mattress.daysToRotate} days</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle2" color="text.secondary">Lifecycle Ends</Typography>
//               <Typography 
//                 variant="body1" 
//                 fontWeight="medium"
//                 color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error' : 'inherit'}
//               >
//                 {new Date(mattress.lifeCyclesEnd).toLocaleDateString()}
//               </Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle2" color="text.secondary">Organisation</Typography>
//               <Typography variant="body1" fontWeight="medium">{mattress.organisation}</Typography>
//             </Grid>
//           </Grid>
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ 
//         flexGrow: 1, 
//         p: 3, 
//         mt: 1, // Reduced top margin
//         ml: { xs: 2, sm: 4, md: 6, lg: 10 } // Responsive left margin
//       }}>
//         {/* Mattresses Heading */}
//         <Typography 
//           variant="h4" 
//           component="h1" 
//           sx={{ 
//             fontWeight: 'bold', 
//             color: '#1e293b',
//             fontSize: { xs: '1.5rem', md: '2rem' },
//             mb: 3,
//             pl: 2 
//           }}
//         >
//           Mattresses
//         </Typography>

//         {/* Search and Filters in the same line */}
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between', 
//           mb: 4,
//           flexDirection: { xs: 'column', sm: 'row' } // Stack on small screens
//         }}>
//           {/* Search Bar */}
//           <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
//             <TextField
//               placeholder="Search mattresses..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: <Search color="action" sx={{ mr: 1 }} />,
//               }}
//               sx={{ 
//                 width: '100%',
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   bgcolor: 'white'
//                 }
//               }}
//             />
//           </Box>

//           {/* Icons for small screens */}
//           <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 2 }}>
//             <IconButton onClick={() => {/* Handle search icon click */}}>
//               <Search />
//             </IconButton>
//             <IconButton onClick={() => {/* Handle filter icon click */}}>
//               <FilterList />
//             </IconButton>
//           </Box>

//           {/* Filters */}
//           <Box sx={{ 
//             display: 'flex', 
//             gap: 2, 
//             flex: 1 
//           }}>
//             <FormControl fullWidth>
//               <InputLabel>Type</InputLabel>
//               <Select
//                 value={typeFilter}
//                 label="Type"
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 <MenuItem value="all">All Types</MenuItem>
//                 <MenuItem value="King">King</MenuItem>
//                 <MenuItem value="Queen">Queen</MenuItem>
//                 <MenuItem value="Single">Single</MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl fullWidth>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={statusFilter}
//                 label="Status"
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <MenuItem value="all">All Statuses</MenuItem>
//                 <MenuItem value="In production">In production</MenuItem>
//                 <MenuItem value="Transferred out">Transferred out</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         </Box>

//         {/* Tabs centered horizontally */}
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           borderBottom: 1, 
//           borderColor: 'divider', 
//           mb: 3,
//           width: '100%'
//         }}>
//           <Tabs 
//             value={tabValue} 
//             onChange={handleTabChange}
//             sx={{ 
//               '& .MuiTab-root': { 
//                 fontWeight: 600,
//                 fontSize: '0.95rem',
//                 textTransform: 'none',
//                 minWidth: 100
//               },
//               '& .Mui-selected': {
//                 color: '#008080'
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: '#008080'
//               }
//             }}
//           >
//             <Tab label="Yours" />
//             <Tab label="All" />
//           </Tabs>
//         </Box>

//         {/* Mattress Cards Grid */}
//         <Grid container spacing={3}>
//           {filteredMattresses.map((mattress) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={mattress.id}>
//               <Card sx={{
//                 height: '100%',
//                 borderRadius: 2,
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                 '&:hover': {
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
//                   transform: 'translateY(-4px)'
//                 },
//                 transition: 'all 0.3s ease'
//               }}>
//                 <Box sx={{ 
//                   p: 2,
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                   borderBottom: '1px solid rgba(0,0,0,0.06)',
//                   bgcolor: getMattressColor(mattress.type) + '10'
//                 }}>
//                   <Chip 
//                     label={mattress.status} 
//                     size="small" 
//                     color={getStatusColor(mattress.status)}
//                     sx={{ fontWeight: 600 }}
//                   />
//                   <IconButton 
//                     size="small"
//                     onClick={() => handleOpenDialog(mattress)}
//                   >
//                     <Info fontSize="small" />
//                   </IconButton>
//                 </Box>

//                 <CardContent>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                     <Avatar 
//                       sx={{ 
//                         bgcolor: getMattressColor(mattress.type),
//                         mr: 2
//                       }}
//                     >
//                       <KingBed />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                         {mattress.type}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {mattress.location}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="body2" sx={{ 
//                       display: 'flex', 
//                       alignItems: 'center',
//                       mb: 1
//                     }}>
//                       <Loop sx={{ mr: 1, fontSize: 18 }} />
//                       Days to Rotate: {mattress.daysToRotate} days
//                     </Typography>
                    
//                     <Typography variant="body2" sx={{ 
//                       display: 'flex', 
//                       alignItems: 'center',
//                       mb: 1
//                     }}>
//                       <EventAvailable sx={{ mr: 1, fontSize: 18 }} />
//                       Lifecycle Ends: {new Date(mattress.lifeCyclesEnd).toLocaleDateString()}
//                     </Typography>
//                   </Box>

//                   {/* Progress bar */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="caption" sx={{ 
//                       display: 'flex', 
//                       justifyContent: 'space-between',
//                       mb: 0.5,
//                       color: 'text.secondary'
//                     }}>
//                       <span>Lifecycle Progress</span>
//                       <span>{getDaysRemaining(mattress.lifeCyclesEnd)} days left</span>
//                     </Typography>
//                     <Box sx={{ 
//                       width: '100%', 
//                       height: 4, 
//                       bgcolor: '#e2e8f0',
//                       borderRadius: 2,
//                       overflow: 'hidden'
//                     }}>
//                       <Box sx={{ 
//                         height: '100%', 
//                         width: `${100 - (getDaysRemaining(mattress.lifeCyclesEnd) / 1000 * 100)}%`,
//                         bgcolor: getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? '#ef4444' : '#008080'
//                       }} />
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Detail Dialog */}
//       <DetailDialog 
//         mattress={selectedMattress}
//         open={openDialog}
//         onClose={handleCloseDialog}
//       />
//     </>
//   );
// };

// export default MattressPage; 


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
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  Tooltip,
  InputAdornment,
  Fade,
  LinearProgress
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Edit, 
  MoreVert, 
  KingBed, 
  Loop, 
  EventAvailable,
  Info,
  Close,
  Refresh,
  LocationOn,
  Business,
  Add
} from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import CustomSidebar from '../components/layout/Sidebar';

// Sample data for mattresses
const sampleMattresses = [
  {
    id: 1,
    type: 'King',
    location: 'Room 101',
    status: 'In production',
    daysToRotate: 90,
    lifeCyclesEnd: '2025-12-31',
    organisation: 'Grand Hotel'
  },
  {
    id: 2,
    type: 'Queen',
    location: 'Room 203',
    status: 'In production',
    daysToRotate: 60,
    lifeCyclesEnd: '2024-10-15',
    organisation: 'Luxury Suites'
  },
  {
    id: 3,
    type: 'Single',
    location: 'Storage A',
    status: 'Transferred out',
    daysToRotate: 45,
    lifeCyclesEnd: '2023-08-22',
    organisation: 'Budget Inn'
  },
  {
    id: 4,
    type: 'King',
    location: 'Room 305',
    status: 'In production',
    daysToRotate: 90,
    lifeCyclesEnd: '2026-02-18',
    organisation: 'Grand Hotel'
  },
  {
    id: 5,
    type: 'Queen',
    location: 'Storage B',
    status: 'Transferred out',
    daysToRotate: 60,
    lifeCyclesEnd: '2023-11-30',
    organisation: 'Luxury Suites'
  },
  {
    id: 6,
    type: 'Single',
    location: 'Room 110',
    status: 'In production',
    daysToRotate: 45,
    lifeCyclesEnd: '2024-05-10',
    organisation: 'Budget Inn'
  },
  {
    id: 7,
    type: 'King',
    location: 'Room 401',
    status: 'In production',
    daysToRotate: 90,
    lifeCyclesEnd: '2025-08-15',
    organisation: 'Grand Hotel'
  },
  {
    id: 8,
    type: 'Queen',
    location: 'Room 202',
    status: 'In production',
    daysToRotate: 60,
    lifeCyclesEnd: '2024-12-20',
    organisation: 'Luxury Suites'
  }
];

const MattressPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredMattresses, setFilteredMattresses] = useState(sampleMattresses);
  const [selectedMattress, setSelectedMattress] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Dialog handlers
  const handleOpenDialog = (mattress) => {
    setSelectedMattress(mattress);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMattress(null);
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
    let result = sampleMattresses;
    
    // Filter by tab (Yours or All)
    if (tabValue === 0) {
      // "Yours" tab - could filter by user's organization in a real app
      result = sampleMattresses.filter(mattress => mattress.organisation === 'Grand Hotel');
    }
    
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
      result = result.filter(mattress => mattress.status === statusFilter);
    }
    
    setFilteredMattresses(result);
  }, [tabValue, searchTerm, typeFilter, statusFilter]);

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

  // Get mattress icon color based on type
  const getMattressColor = (type) => {
    switch (type) {
      case 'King':
        return '#8a2be2'; // Purple for King
      case 'Queen':
        return '#1e90ff'; // Blue for Queen
      case 'Single':
        return '#20b2aa'; // Teal for Single
      default:
        return '#607d8b'; // Gray for others
    }
  };

  // Calculate days remaining until lifecycle end
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate lifecycle percentage
  const getLifecyclePercentage = (endDate) => {
    const daysRemaining = getDaysRemaining(endDate);
    // Assuming a 3-year lifecycle (1095 days)
    const totalDays = 1095;
    const daysUsed = totalDays - daysRemaining;
    return Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));
  };

  // Detailed Info Dialog
  const DetailDialog = ({ mattress, open, onClose }) => {
    if (!mattress) return null;
    
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: getMattressColor(mattress.type) + '15',
          borderBottom: `4px solid ${getMattressColor(mattress.type)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: getMattressColor(mattress.type), mr: 2 }}>
              <KingBed />
            </Avatar>
            <Typography variant="h6">
              {mattress.type} Mattress Details
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={mattress.status} 
                    size="small" 
                    color={getStatusColor(mattress.status)}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ID: #{mattress.id}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  {mattress.location}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">Days to Rotate</Typography>
              <Typography variant="h6" fontWeight="medium" color="primary">
                {mattress.daysToRotate} days
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">Organisation</Typography>
              <Typography variant="h6" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                <Business fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                {mattress.organisation}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Lifecycle Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">End Date</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main'}
                  >
                    {new Date(mattress.lifeCyclesEnd).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Days Remaining</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main'}
                  >
                    {getDaysRemaining(mattress.lifeCyclesEnd)} days
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
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
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}>
                    {Math.round(getLifecyclePercentage(mattress.lifeCyclesEnd))}% used
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} color="inherit">Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            sx={{ 
              bgcolor: getMattressColor(mattress.type),
              '&:hover': {
                bgcolor: getMattressColor(mattress.type) + 'dd',
              }
            }}
          >
            Edit Mattress
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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
        <DialogTitle>
          Search & Filter
          <IconButton 
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Search mattresses..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={localTypeFilter}
                label="Type"
                onChange={(e) => setLocalTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="King">King</MenuItem>
                <MenuItem value="Queen">Queen</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={localStatusFilter}
                label="Status"
                onChange={(e) => setLocalStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="In production">In production</MenuItem>
                <MenuItem value="Transferred out">Transferred out</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleApplyFilters} 
            variant="contained" 
            color="primary"
          >
            Apply Filters
          </Button>
        </DialogActions>
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
            Mattresses
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#008080',
              '&:hover': {
                bgcolor: '#006666',
              },
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            Add Mattress
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

        {/* Search and Filters */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: 4, 
            borderRadius: 2,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Desktop Search */}
          <Box sx={{ 
            flex: 2, 
            width: '100%',
            display: { xs: 'none', md: 'block' } 
          }}>
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
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#008080',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#008080',
                  }
                }
              }}
            />
          </Box>
          
          {/* Mobile Search & Filter Button */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <Button 
              variant="outlined"
              startIcon={<Search />}
              onClick={handleOpenSearchDialog}
              sx={{ 
                borderColor: '#e2e8f0',
                color: '#64748b',
                flex: 1,
                mr: 1,
                justifyContent: 'flex-start',
                '&:hover': {
                  borderColor: '#008080',
                  bgcolor: 'rgba(0, 128, 128, 0.04)'
                }
              }}
            >
              Search...
            </Button>
            <Button 
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleOpenSearchDialog}
              sx={{ 
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#008080',
                  bgcolor: 'rgba(0, 128, 128, 0.04)'
                }
              }}
            >
              Filters
            </Button>
          </Box>
          
          {/* Desktop Filters */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 2,
            flex: 1,
            width: '100%'
          }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#008080',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#008080',
                  }
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="King">King</MenuItem>
                <MenuItem value="Queen">Queen</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#008080',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#008080',
                  }
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="In production">In production</MenuItem>
                <MenuItem value="Transferred out">Transferred out</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="Reset Filters">
              <IconButton 
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                sx={{ 
                  bgcolor: 'white',
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    bgcolor: 'rgba(0, 128, 128, 0.04)',
                    borderColor: '#008080'
                  }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
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
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredMattresses.length} mattresses
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Sort by:
              </Typography>
              <Select
                value="newest"
                size="small"
                sx={{ 
                  minWidth: 120,
                  height: 32,
                  fontSize: '0.875rem',
                  '& .MuiSelect-select': {
                    py: 0.5
                  }
                }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="lifecycle">Lifecycle End</MenuItem>
              </Select>
            </Box>
          )}
        </Box>

        {/* Mattress Cards Grid */}
        <Grid container spacing={3}>
          {filteredMattresses.length > 0 ? (
            filteredMattresses.map((mattress) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={mattress.id}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transform: 'translateY(-5px)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {/* Card Header */}
                  <Box sx={{ 
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: getMattressColor(mattress.type) + '10'
                  }}>
                    <Chip 
                      label={mattress.status} 
                      size="small" 
                      color={getStatusColor(mattress.status)}
                      sx={{ fontWeight: 600 }}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenDialog(mattress)}
                      sx={{ 
                        color: '#64748b',
                        '&:hover': { color: '#008080' }
                      }}
                    >
                      <Info fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getMattressColor(mattress.type),
                          mr: 2,
                          width: 45,
                          height: 45,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mb: 1,
                        color: '#475569'
                      }}>
                        <span>Days to Rotate:</span>
                        <Box component="span" sx={{ fontWeight: 600, color: '#008080' }}>
                          {mattress.daysToRotate} days
                        </Box>
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 1,
                        color: '#475569'
                      }}>
                        <span>Organisation:</span>
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          {mattress.organisation}
                        </Box>
                      </Typography>
                    </Box>

                    {/* Lifecycle Progress */}
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Lifecycle Ends
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium"
                          color={getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? 'error.main' : 'success.main'}
                        >
                          {new Date(mattress.lifeCyclesEnd).toLocaleDateString()}
                        </Typography>
                      </Box>
                                            <Box sx={{ 
                        width: '100%', 
                        height: 4, 
                        bgcolor: '#e2e8f0',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          height: '100%', 
                          width: `${getLifecyclePercentage(mattress.lifeCyclesEnd)}%`,
                          bgcolor: getDaysRemaining(mattress.lifeCyclesEnd) < 90 ? '#ef4444' : '#008080',
                          borderRadius: 2
                        }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}>
                        {getDaysRemaining(mattress.lifeCyclesEnd)} days left
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Card Actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    p: 1,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: '#f8fafc'
                  }}>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          mr: 1,
                          color: '#64748b',
                          '&:hover': { 
                            color: '#008080',
                            bgcolor: 'rgba(0,128,128,0.1)'
                          }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Options">
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#64748b',
                          '&:hover': { 
                            color: '#008080',
                            bgcolor: 'rgba(0,128,128,0.1)'
                          }
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
      </Box>

      {/* Detail Dialog */}
      <DetailDialog 
        mattress={selectedMattress}
        open={openDialog}
        onClose={handleCloseDialog}
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
                  