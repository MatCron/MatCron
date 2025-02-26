// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   Tooltip,
//   Chip,
//   InputAdornment,
//   useTheme,
//   alpha,
//   Grid,
//   Avatar,
//   Menu,
//   MenuItem,
//   Divider,
//   Badge,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   Stack,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
// } from '@mui/material';
// import {
//   PersonAdd as PersonAddIcon,
//   Search as SearchIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   MoreVert as MoreVertIcon,
//   Mail as MailIcon,
//   Check as CheckIcon,
//   FilterList as FilterListIcon,
//   Close as CloseIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import Navbar from '../../components/layout/Navbar';
// import Sidebar from '../../components/layout/Sidebar';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(12);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [openRoleDialog, setOpenRoleDialog] = useState(false);
//   const [newRole, setNewRole] = useState('');
//   const theme = useTheme();
//   const drawerWidth = 240;

//   // Mock data for development
//   const mockUsers = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
//     { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Manager', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
//     { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
//     { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Admin', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
//     { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', role: 'User', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
//     { id: 7, name: 'David Miller', email: 'david@example.com', role: 'Manager', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
//     { id: 8, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
//     { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', role: 'User', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
//     { id: 7, name: 'David Miller', email: 'david@example.com', role: 'Manager', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
//     { id: 8, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },    { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', role: 'User', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
//     { id: 7, name: 'David Miller', email: 'david@example.com', role: 'Manager', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
//     { id: 8, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
//   ];

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       // For development, use mock data
//       setUsers(mockUsers);
      
//       // For production, uncomment this:
//       // const response = await axios.get('/api/users');
//       // setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//     setPage(0);
//   };

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         // For production, uncomment this:
//         // await axios.delete(`/api/users/${userId}`);
        
//         // For development:
//         setUsers(users.filter(user => user.id !== userId));
//       } catch (error) {
//         console.error('Error deleting user:', error);
//       }
//     }
//   };

//   const handleMenuOpen = (event, user) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedUser(user);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleOpenRoleDialog = () => {
//     setNewRole(selectedUser.role);
//     setOpenRoleDialog(true);
//     handleMenuClose();
//   };

//   const handleCloseRoleDialog = () => {
//     setOpenRoleDialog(false);
//   };

//   const handleRoleChange = (event) => {
//     setNewRole(event.target.value);
//   };

//   const handleSaveRole = async () => {
//     try {
//       // For production, uncomment this:
//       // await axios.patch(`/api/users/${selectedUser.id}`, { role: newRole });
      
//       // For development:
//       setUsers(users.map(user => 
//         user.id === selectedUser.id ? { ...user, role: newRole } : user
//       ));
      
//       handleCloseRoleDialog();
//     } catch (error) {
//       console.error('Error updating user role:', error);
//     }
//   };

//   const filteredUsers = users.filter((user) =>
//     user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.role?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const loadMore = () => {
//     setRowsPerPage(rowsPerPage + 8);
//   };

//   // Get role color
//   const getRoleColor = (role) => {
//     switch (role) {
//       case 'Admin':
//         return theme.palette.primary.main;
//       case 'Manager':
//         return theme.palette.info.main;
//       case 'User':
//         return theme.palette.grey[600];
//       default:
//         return theme.palette.grey[500];
//     }
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     return status === 'Active' ? theme.palette.success.main : theme.palette.warning.main;
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <Navbar />
//       <Sidebar open={false} drawerWidth={drawerWidth} />
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           marginTop: '120px',
//           marginLeft: `${drawerWidth}px`,
//           width: `calc(100% - ${drawerWidth}px)`,
//           transition: theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//           backgroundColor: alpha(theme.palette.background.default, 0.4),
//           minHeight: 'calc(100vh - 120px)',
//           position: 'fixed',
//           right: 0,
//           overflowY: 'auto',
//           height: '100vh',
//           boxSizing: 'border-box'
//         }}
//       >
//         <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h4" sx={{ 
//             color: theme.palette.text.primary, 
//             fontWeight: 600,
//             fontSize: { xs: '1.5rem', md: '2rem' }
//           }}>
//             Users Management
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<PersonAddIcon />}
//             sx={{
//               backgroundColor: theme.palette.primary.main,
//               '&:hover': { backgroundColor: theme.palette.primary.dark },
//               borderRadius: 2,
//               textTransform: 'none',
//               px: 3,
//               py: 1,
//               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//             }}
//           >
//             Invite New User
//           </Button>
//         </Box>

//         <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <TextField
//             placeholder="Search users..."
//             variant="outlined"
//             size="small"
//             value={searchQuery}
//             onChange={handleSearch}
//             sx={{ 
//               width: { xs: '100%', sm: '350px' },
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 2,
//                 backgroundColor: alpha(theme.palette.background.paper, 0.8),
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: 'text.secondary' }} />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             startIcon={<FilterListIcon />}
//             sx={{ 
//               color: theme.palette.text.secondary,
//               '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
//               borderRadius: 2,
//             }}
//           >
//             Filter
//           </Button>
//         </Box>

//         <Grid container spacing={3}>
//           {paginatedUsers.map((user) => (
//             <Grid item xs={12} sm={12} md={6} key={user.id}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 2,
//                   borderRadius: 3,
//                   boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//                   border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                   height: '100%',
//                   transition: 'transform 0.3s, box-shadow 0.3s',
//                   '&:hover': {
//                     transform: 'translateY(-5px)',
//                     boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
//                   },
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}
//               >
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
//                   <Badge
//                     overlap="circular"
//                     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                     badgeContent={
//                       <Box
//                         sx={{
//                           width: 12,
//                           height: 12,
//                           borderRadius: '50%',
//                           backgroundColor: getStatusColor(user.status),
//                           border: '2px solid white'
//                         }}
//                       />
//                     }
//                   >
//                     <Avatar
//                       src={user.avatar}
//                       alt={user.name}
//                       sx={{ width: 56, height: 56 }}
//                     />
//                   </Badge>
//                   <Box sx={{ flex: 1 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
//                       {user.name}
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                       <MailIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: '0.9rem' }} />
//                       <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
//                         {user.email}
//                       </Typography>
//                     </Box>
//                     <Chip
//                       label={user.role}
//                       size="small"
//                       sx={{
//                         backgroundColor: getRoleColor(user.role),
//                         color: 'white',
//                         fontWeight: 500,
//                         height: 24,
//                         fontSize: '0.75rem'
//                       }}
//                     />
//                   </Box>
//                 </Box>
//                 <Box>
//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleMenuOpen(e, user)}
//                     sx={{ 
//                       color: theme.palette.text.secondary,
//                       backgroundColor: alpha(theme.palette.background.paper, 0.5),
//                       '&:hover': {
//                         backgroundColor: alpha(theme.palette.background.paper, 0.8),
//                       }
//                     }}
//                   >
//                     <MoreVertIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>

//         {filteredUsers.length > rowsPerPage && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//             <Button
//               variant="outlined"
//               onClick={loadMore}
//               sx={{
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 borderColor: theme.palette.primary.main,
//                 color: theme.palette.primary.main,
//                 px: 4,
//                 py: 1,
//                 '&:hover': {
//                   borderColor: theme.palette.primary.dark,
//                   backgroundColor: alpha(theme.palette.primary.main, 0.05)
//                 }
//               }}
//             >
//               Load More
//             </Button>
//           </Box>
//         )}

//         {filteredUsers.length === 0 && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               borderRadius: 3,
//               textAlign: 'center',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//             }}
//           >
//             <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
//               No users found
//             </Typography>
//             <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 1 }}>
//               Try adjusting your search or filter to find what you're looking for.
//             </Typography>
//           </Paper>
//         )}

//         {/* User action menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//           PaperProps={{
//             elevation: 3,
//             sx: {
//               borderRadius: 2,
//               minWidth: 180,
//               boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//             }
//           }}
//         >
//           <MenuItem onClick={handleOpenRoleDialog}>
//             <EditIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.primary.main }} />
//             Change Role
//           </MenuItem>
//           <MenuItem onClick={handleMenuClose}>
//             <EditIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.info.main }} />
//             Edit User
//           </MenuItem>
//           <Divider />
//           <MenuItem onClick={() => { handleDeleteUser(selectedUser?.id); handleMenuClose(); }}>
//             <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.error.main }} />
//             Delete User
//           </MenuItem>
//         </Menu>

//         {/* Enhanced Role change dialog */}
//         <Dialog 
//           open={openRoleDialog} 
//           onClose={handleCloseRoleDialog}
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
//               maxWidth: '400px',
//               width: '100%'
//             }
//           }}
//         >
//           <DialogTitle sx={{ 
//             pb: 1, 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//           }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               {selectedUser && (
//                 <Avatar src={selectedUser.avatar} alt={selectedUser.name} />
//               )}
//               <Box>
//                 <Typography variant="h6">Change User Role</Typography>
//                 {selectedUser && (
//                   <Typography variant="body2" color="text.secondary">
//                     {selectedUser.name}
//                   </Typography>
//                 )}
//               </Box>
//             </Box>
//             <IconButton size="small" onClick={handleCloseRoleDialog}>
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent sx={{ pt: 3, pb: 2 }}>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               Select the appropriate role for this user. This will determine their access level and permissions.
//             </Typography>
//             <RadioGroup
//               value={newRole}
//               onChange={handleRoleChange}
//               sx={{ mt: 1 }}
//             >
//               <Paper 
//                 elevation={0} 
//                 sx={{ 
//                   mb: 1.5, 
//                   p: 1.5, 
//                   borderRadius: 2,
//                   border: `1px solid ${newRole === 'Admin' ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
//                   backgroundColor: newRole === 'Admin' ? alpha(theme.palette.primary.main, 0.05) : 'transparent'
//                 }}
//               >
//                 <FormControlLabel 
//                   value="Admin" 
//                   control={<Radio color="primary" />} 
//                   label={
//                     <Box>
//                       <Typography variant="subtitle2">Admin</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Full access to all features and settings
//                       </Typography>
//                     </Box>
//                   }
//                 />
//               </Paper>
              
//               <Paper 
//                 elevation={0} 
//                 sx={{ 
//                   mb: 1.5, 
//                   p: 1.5, 
//                   borderRadius: 2,
//                   border: `1px solid ${newRole === 'Manager' ? theme.palette.info.main : alpha(theme.palette.divider, 0.1)}`,
//                   backgroundColor: newRole === 'Manager' ? alpha(theme.palette.info.main, 0.05) : 'transparent'
//                 }}
//               >
//                 <FormControlLabel 
//                   value="Manager" 
//                   control={<Radio color="info" />} 
//                   label={
//                     <Box>
//                       <Typography variant="subtitle2">Manager</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Can manage users and content, but not system settings
//                       </Typography>
//                     </Box>
//                   }
//                 />
//               </Paper>
              
//               <Paper 
//                 elevation={0} 
//                 sx={{ 
//                   mb: 1.5, 
//                   p: 1.5, 
//                   borderRadius: 2,
//                   border: `1px solid ${newRole === 'User' ? theme.palette.grey[500] : alpha(theme.palette.divider, 0.1)}`,
//                   backgroundColor: newRole === 'User' ? alpha(theme.palette.grey[500], 0.05) : 'transparent'
//                 }}
//               >
//                 <FormControlLabel 
//                   value="User" 
//                   control={<Radio color="default" />} 
//                   label={
//                     <Box>
//                       <Typography variant="subtitle2">User</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Basic access to view and interact with content
//                       </Typography>
//                     </Box>
//                   }
//                 />
//               </Paper>
//             </RadioGroup>
//           </DialogContent>
//           <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
//             <Button 
//               onClick={handleCloseRoleDialog}
//               sx={{ 
//                 color: theme.palette.text.secondary,
//                 borderRadius: 2,
//                 textTransform: 'none',
//               }}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSaveRole} 
//               variant="contained"
//               startIcon={<CheckIcon />}
//               sx={{ 
//                 backgroundColor: theme.palette.primary.main,
//                 '&:hover': { backgroundColor: theme.palette.primary.dark },
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 px: 3
//               }}
//             >
//               Save Changes
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };

// export default Users;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  InputAdornment,
  useTheme,
  alpha,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Mail as MailIcon,
  Check as CheckIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState('');
  const theme = useTheme();
  const drawerWidth = 240;

  // Mock data for development
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith.longemailaddress@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Manager', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Admin', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: 6, name: 'Sarah Brown', email: 'sarah.brown.longemail@example.com', role: 'User', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { id: 7, name: 'David Miller', email: 'david@example.com', role: 'Manager', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: 8, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'User', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { id: 9, name: 'Mark Johnson', email: 'mark.johnson.longone@example.com', role: 'Admin', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // For development, use mock data
      setUsers(mockUsers);

      // For production, uncomment this:
      // const response = await axios.get('/api/users');
      // setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // For production, uncomment this:
        // await axios.delete(`/api/users/${userId}`);

        // For development:
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenRoleDialog = () => {
    setNewRole(selectedUser.role);
    setOpenRoleDialog(true);
    handleMenuClose();
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);
  };

  const handleSaveRole = async () => {
    try {
      // For production, uncomment this:
      // await axios.patch(`/api/users/${selectedUser.id}`, { role: newRole });

      // For development:
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, role: newRole } : user
        )
      );
      handleCloseRoleDialog();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Filter users by search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase());

    // If 'All' is selected, ignore role filter
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const loadMore = () => {
    setRowsPerPage(rowsPerPage + 8);
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return theme.palette.primary.main;
      case 'Manager':
        return theme.palette.info.main;
      case 'User':
        return theme.palette.grey[600];
      default:
        return theme.palette.grey[500];
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'Active'
      ? theme.palette.success.main
      : theme.palette.warning.main;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar open={false} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '120px',
          marginLeft: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: alpha(theme.palette.background.default, 0.4),
          minHeight: 'calc(100vh - 120px)',
          position: 'fixed',
          right: 0,
          overflowY: 'auto',
          height: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Users Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            Invite New User
          </Button>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: { xs: '100%', sm: '250px', md: '350px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Role Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              label="Role"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={<FilterListIcon />}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
              borderRadius: 2,
            }}
          >
            Filter
          </Button>
        </Box>

        <Grid container spacing={3}>
          {paginatedUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={user.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(user.status),
                          border: '2px solid white',
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ width: 56, height: 56 }}
                    />
                  </Badge>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}
                    >
                      {user.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        // Restrict email width & show ellipsis if too long
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
                      }}
                    >
                      <MailIcon
                        fontSize="small"
                        sx={{
                          color: theme.palette.text.secondary,
                          mr: 1,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          flexGrow: 1,
                        }}
                        title={user.email}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: getRoleColor(user.role),
                        color: 'white',
                        fontWeight: 500,
                        height: 24,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, user)}
                    sx={{
                      color: theme.palette.text.secondary,
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {filteredUsers.length > rowsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={loadMore}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                px: 4,
                py: 1,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              Load More
            </Button>
          </Box>
        )}

        {filteredUsers.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mt: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              No users found
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 1 }}>
              Try adjusting your search or role filter to find what you're looking for.
            </Typography>
          </Paper>
        )}

        {/* User action menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 180,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <MenuItem onClick={handleOpenRoleDialog}>
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            Change Role
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.info.main }} />
            Edit User
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleDeleteUser(selectedUser?.id);
              handleMenuClose();
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.error.main }} />
            Delete User
          </MenuItem>
        </Menu>

        {/* Enhanced Role change dialog */}
        <Dialog
          open={openRoleDialog}
          onClose={handleCloseRoleDialog}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              maxWidth: '400px',
              width: '100%',
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedUser && (
                <Avatar src={selectedUser.avatar} alt={selectedUser.name} />
              )}
              <Box>
                <Typography variant="h6">Change User Role</Typography>
                {selectedUser && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.name}
                  </Typography>
                )}
              </Box>
            </Box>
            <IconButton size="small" onClick={handleCloseRoleDialog}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the appropriate role for this user. This will determine
              their access level and permissions.
            </Typography>
            <RadioGroup value={newRole} onChange={handleRoleChange} sx={{ mt: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border:
                    newRole === 'Admin'
                      ? `1px solid ${theme.palette.primary.main}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor:
                    newRole === 'Admin'
                      ? alpha(theme.palette.primary.main, 0.05)
                      : 'transparent',
                }}
              >
                <FormControlLabel
                  value="Admin"
                  control={<Radio color="primary" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Admin</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Full access to all features and settings
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border:
                    newRole === 'Manager'
                      ? `1px solid ${theme.palette.info.main}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor:
                    newRole === 'Manager'
                      ? alpha(theme.palette.info.main, 0.05)
                      : 'transparent',
                }}
              >
                <FormControlLabel
                  value="Manager"
                  control={<Radio color="info" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Manager</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Can manage users and content, but not system settings
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border:
                    newRole === 'User'
                      ? `1px solid ${theme.palette.grey[500]}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor:
                    newRole === 'User'
                      ? alpha(theme.palette.grey[500], 0.05)
                      : 'transparent',
                }}
              >
                <FormControlLabel
                  value="User"
                  control={<Radio color="default" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">User</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Basic access to view and interact with content
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={handleCloseRoleDialog}
              sx={{
                color: theme.palette.text.secondary,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRole}
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Users;
