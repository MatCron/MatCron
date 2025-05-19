import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  styled,
  Link
} from '@mui/material';
import {
  SearchOutlined,
  QrCode2,
  Inventory2,
  FactCheck,
  FileDownload,
  Article,
  VerifiedUser,
  Description,
  CheckCircle,
  LocationOn,
  Phone,
  OpenInNew,
  StarRate,
  AccessTime
} from '@mui/icons-material';
import qrCodeImage from '../../assets/images/qr.png';
import mattressImage from '../../assets/images/bed.jpg';
import logoImage from '../../assets/images/MATCRON_Logo.png';
import mapBackground from '../../assets/images/map.png'; // Using the Ireland map image

// Styled components
const StyledHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #008080 0%, #20B2AA 100%)',
  padding: theme.spacing(4, 3),
  color: 'white',
  borderRadius: '0 0 24px 24px',
  boxShadow: '0 6px 20px rgba(0,128,128,0.15)',
  marginBottom: theme.spacing(5),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    zIndex: 1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: 0
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 16px 30px rgba(0,0,0,0.12)'
  }
}));

const DocumentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #e0e0e0',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.04)',
    transform: 'translateX(5px)',
    borderColor: '#008080'
  }
}));

const GuestPage = () => {
  const [mattressInfo, setMattressInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  // Mock data for mattress information
  const mockMattressData = {
    id: 'MAT-001',
    serialNumber: 'SN12345678',
    epcCode: 'EPC-12345ABC',
    qrCode: qrCodeImage,
    manufacturer: 'ComfortSleep Inc.',
    model: 'Premium Comfort Plus',
    type: 'Memory Foam',
    size: 'Queen',
    dimensions: '60" x 80" x 12"',
    manufactureDate: '2023-01-15',
    warrantyPeriod: '10 years',
    materials: [
      { name: 'Memory Foam', percentage: 65, certifications: ['CertiPUR-US'] },
      { name: 'Support Foam', percentage: 30, certifications: ['OEKO-TEX'] },
      { name: 'Fabric Cover', percentage: 5, certifications: ['GREENGUARD'] }
    ],
    certifications: [
      'ISO 9001',
      'OEKO-TEX Standard 100',
      'CertiPUR-US',
      'GREENGUARD Gold'
    ],
    fireRetardancy: 'BS 7177:2008+A1:2011 - Medium Hazard',
    disposalInstructions: 'Contact your nearest recycling center for proper mattress disposal. Most centers accept mattresses for a small fee and ensure they are recycled in an environmentally friendly manner.',
    recyclingPercentage: 85,
    sustainabilityScore: 'A',
    documents: [
      { name: 'Warranty Certificate', type: 'PDF', date: '2023-01-15' },
      { name: 'Material Safety Data Sheet', type: 'PDF', date: '2023-01-10' },
      { name: 'Care Instructions', type: 'PDF', date: '2023-01-15' },
      { name: 'Fire Retardancy Certificate', type: 'PDF', date: '2022-12-20' },
      { name: 'Environmental Impact Assessment', type: 'PDF', date: '2022-11-30' }
    ],
    distributionChain: [
      { stage: 'Manufacturing', location: 'Factory A, Detroit, MI', date: '2023-01-15' },
      { stage: 'QA Testing', location: 'QA Lab, Detroit, MI', date: '2023-01-20' },
      { stage: 'Distribution Center', location: 'Regional DC, Chicago, IL', date: '2023-01-25' },
      { stage: 'Retailer', location: 'Comfort Sleep Store, Columbus, OH', date: '2023-02-05' }
    ],
    recyclingCenters: [
      { 
        name: 'Dublin Recycling Center', 
        address: '123 Main Street, Dublin', 
        phone: '01-234-5678', 
        website: 'www.dublinrecycling.ie',
        hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
        rating: 4.5,
        fee: '€15 per mattress'
      },
      { 
        name: 'Cork Mattress Disposal', 
        address: '45 South Mall, Cork', 
        phone: '021-987-6543', 
        website: 'www.corkdisposal.ie',
        hours: 'Mon-Sat: 9AM-5PM',
        rating: 4.8,
        fee: '€12 per mattress'
      },
      { 
        name: 'Galway Green Recyclers', 
        address: '78 Eyre Square, Galway', 
        phone: '091-123-4567', 
        website: 'www.galwayrecyclers.ie',
        hours: 'Mon-Fri: 8:30AM-5:30PM',
        rating: 4.7,
        fee: '€10 per mattress'
      },
      { 
        name: 'Limerick Eco Center', 
        address: '32 O\'Connell Street, Limerick', 
        phone: '061-876-5432', 
        website: 'www.limerickeco.ie',
        hours: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM',
        rating: 4.6,
        fee: '€14 per mattress'
      }
    ]
  };

  // Use useEffect to simulate loading the data
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setMattressInfo(mockMattressData);
      setLoading(false);
    }, 1000); // Simulate a 1-second load time
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to render the mattress info section
  const renderMattressInfo = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#008080' }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1">
            Please try again or contact support for assistance.
          </Typography>
        </Box>
      );
    }

    if (!mattressInfo) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No mattress information found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please try again later or contact customer support.
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {/* Mattress overview card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            mb: 4,
            background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
            border: '1px solid #e0e0e0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    textAlign: 'center',
                    p: 3,
                    border: '1px dashed #008080',
                    borderRadius: 3,
                    bgcolor: 'rgba(0,128,128,0.04)',
                    boxShadow: 'inset 0 0 20px rgba(0,128,128,0.05)'
                  }}
                >
                  <img
                    src={mattressImage}
                    alt="Mattress"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 8
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#008080', mb: 1, fontWeight: 'bold' }}>
                    Scan QR Code for authenticity
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={mattressInfo.qrCode}
                      alt="QR Code"
                      style={{
                        width: 150,
                        height: 150,
                        padding: 10,
                        border: '2px solid #008080',
                        borderRadius: 12,
                        backgroundColor: 'white',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
                    {mattressInfo.model}
                  </Typography>
                  <Chip
                    label="Verified"
                    icon={<VerifiedUser fontSize="small" />}
                    color="success"
                    size="small"
                    sx={{ ml: 2, fontWeight: 'bold', px: 1 }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 3, color: '#4a5568', fontSize: '1.1rem' }}>
                  by {mattressInfo.manufacturer}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Mattress ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattressInfo.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Serial Number
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattressInfo.serialNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattressInfo.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattressInfo.size}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Manufacture Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(mattressInfo.manufactureDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattressInfo.dimensions}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Warranty
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {mattressInfo.warrantyPeriod}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Sustainability
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Score:
                  </Typography>
                  <Chip
                    label={`${mattressInfo.sustainabilityScore} (${mattressInfo.recyclingPercentage}% recyclable)`}
                    sx={{
                      bgcolor: mattressInfo.sustainabilityScore === 'A' ? '#10b981' : '#f59e0b',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs for details, materials, documents, and supply chain */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              bgcolor: '#f8fafc',
              '& .MuiTabs-indicator': {
                backgroundColor: '#008080',
                height: 3
              },
              '& .Mui-selected': {
                color: '#008080 !important',
                fontWeight: 'bold'
              },
              '& .MuiTab-root': {
                py: 2.5,
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0,128,128,0.04)'
                }
              }
            }}
          >
            <Tab
              label="Materials"
              icon={<Inventory2 />}
              iconPosition="start"
            />
            <Tab
              label="Certifications"
              icon={<FactCheck />}
              iconPosition="start"
            />
            <Tab
              label="Documents"
              icon={<Description />}
              iconPosition="start"
            />
            <Tab
              label="Supply Chain"
              icon={<Article />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Materials Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#2d3748" sx={{ mb: 3 }}>
                  Material Composition
                </Typography>
                <TableContainer sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'rgba(0,128,128,0.08)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Material</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Percentage</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Certifications</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mattressInfo.materials.map((material, index) => (
                        <TableRow key={index} sx={{
                          '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' },
                          '&:hover': { bgcolor: 'rgba(0,128,128,0.04)' }
                        }}>
                          <TableCell sx={{ py: 2 }}><Typography fontWeight="medium">{material.name}</Typography></TableCell>
                          <TableCell sx={{ py: 2 }}>{material.percentage}%</TableCell>
                          <TableCell sx={{ py: 2 }}>
                            {material.certifications.map((cert) => (
                              <Chip 
                                key={cert} 
                                label={cert} 
                                size="small" 
                                sx={{ 
                                  mr: 0.5, 
                                  mb: 0.5,
                                  bgcolor: 'rgba(0,128,128,0.1)',
                                  color: '#006666',
                                  fontWeight: 'medium',
                                  border: '1px solid rgba(0,128,128,0.2)'
                                }} 
                              />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Fire Retardancy
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(0,128,128,0.05)', borderRadius: 2 }}>
                    <Typography variant="body1">
                      {mattressInfo.fireRetardancy}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Disposal Instructions
                  </Typography>
                  <Paper sx={{ p: 3, bgcolor: '#fff8f0', borderRadius: 2, border: '1px solid #ffe0b2', mb: 4 }}>
                    <Typography variant="body1" paragraph>
                      {mattressInfo.disposalInstructions}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        icon={<CheckCircle />}
                        label={`${mattressInfo.recyclingPercentage}% Recyclable`}
                        color="success"
                        sx={{ fontWeight: 'medium', mr: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        By properly recycling this mattress, you're helping reduce landfill waste.
                      </Typography>
                    </Box>
                  </Paper>
                  
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4, mb: 3 }}>
                    Recycling Centers in Ireland
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 0, 
                        borderRadius: 2, 
                        height: 300, 
                        width: '100%', 
                        overflow: 'hidden',
                        position: 'relative',
                        mb: 3
                      }}
                    >
                      <Box sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${mapBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 1,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(255,255,255,0.3)', // Reduced opacity to show map better
                          zIndex: 1
                        }
                      }} />
                      
                      {/* Mock Map Markers */}
                      {mattressInfo.recyclingCenters.map((center, index) => (
                        <Tooltip 
                          key={index} 
                          title={center.name} 
                          placement="top"
                          arrow
                        >
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              zIndex: 2,
                              // Adjusted positions to better match Ireland map locations
                              top: index === 0 ? '30%' : index === 1 ? '80%' : index === 2 ? '40%' : '65%',
                              left: index === 0 ? '53%' : index === 1 ? '40%' : index === 2 ? '25%' : '35%',
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: '50%', 
                                bgcolor: '#008080',
                                border: '3px solid white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                  transform: 'scale(1.3)',
                                  boxShadow: '0 3px 10px rgba(0,0,0,0.5)'
                                }
                              }}
                            >
                              {index + 1}
                            </Box>
                          </Box>
                        </Tooltip>
                      ))}
                      
                      {/* Google Maps Attribution */}
                      <Box sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        right: 10, 
                        bgcolor: 'rgba(255,255,255,0.8)',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '12px',
                        zIndex: 2
                      }}>
                        <Typography variant="caption">© Google Maps 2023</Typography>
                      </Box>
                    </Paper>
                    
                    <Grid container spacing={2}>
                      {mattressInfo.recyclingCenters.map((center, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Paper 
                            elevation={2} 
                            sx={{ 
                              p: 2, 
                              height: '100%', 
                              borderRadius: 2,
                              borderTop: '3px solid #008080',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1.5,
                              pb: 1.5,
                              borderBottom: '1px solid rgba(0,0,0,0.08)'
                            }}>
                              <Box 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  bgcolor: '#008080',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  mr: 2
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                {center.name}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                              <LocationOn sx={{ color: '#64748B', fontSize: 20, mr: 1, mt: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {center.address}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                              <Phone sx={{ color: '#64748B', fontSize: 20, mr: 1, mt: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {center.phone}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start' }}>
                              <AccessTime sx={{ color: '#64748B', fontSize: 20, mr: 1, mt: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {center.hours}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StarRate sx={{ color: '#F59E0B', fontSize: 20 }} />
                                <Typography variant="body2" fontWeight="medium">
                                  {center.rating}/5
                                </Typography>
                              </Box>
                              <Chip 
                                label={center.fee} 
                                size="small" 
                                sx={{ 
                                  bgcolor: 'rgba(0,128,128,0.1)', 
                                  color: '#008080',
                                  fontWeight: 'medium'
                                }} 
                              />
                            </Box>
                            
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              endIcon={<OpenInNew />}
                              sx={{ 
                                mt: 1, 
                                color: '#008080', 
                                borderColor: '#008080',
                                '&:hover': {
                                  borderColor: '#006666',
                                  bgcolor: 'rgba(0,128,128,0.04)'
                                }
                              }}
                              component={Link}
                              href={`https://${center.website}`}
                              target="_blank"
                              rel="noopener"
                            >
                              Visit Website
                            </Button>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Certifications Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#2d3748" sx={{ mb: 3 }}>
                  Product Certifications
                </Typography>
                <Grid container spacing={3}>
                  {mattressInfo.certifications.map((cert, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <StyledCard sx={{ borderTop: '4px solid #008080' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            pb: 2,
                            borderBottom: '1px solid rgba(0,0,0,0.08)'
                          }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'rgba(16,185,129,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                              }}
                            >
                              <CheckCircle sx={{ color: '#10b981' }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold">{cert}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            This certification ensures compliance with industry standards for quality, safety, and environmental responsibility.
                          </Typography>
                          <Button 
                            variant="text" 
                            size="small" 
                            sx={{ 
                              mt: 2, 
                              color: '#008080',
                              '&:hover': { bgcolor: 'rgba(0,128,128,0.08)' }
                            }}
                          >
                            View Certificate
                          </Button>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Documents Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#2d3748" sx={{ mb: 3 }}>
                  Product Documentation
                </Typography>
                {mattressInfo.documents.map((doc, index) => (
                  <DocumentCard key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          bgcolor: 'rgba(0,128,128,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          color: '#008080'
                        }}
                      >
                        <Description />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {doc.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doc.type} • Last updated: {new Date(doc.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownload />}
                      sx={{ 
                        color: '#008080', 
                        borderColor: '#008080',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': { 
                          borderColor: '#006666',
                          bgcolor: 'rgba(0,128,128,0.05)'
                        }
                      }}
                    >
                      Download
                    </Button>
                  </DocumentCard>
                ))}
              </Box>
            )}

            {/* Supply Chain Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#2d3748" sx={{ mb: 4 }}>
                  Supply Chain Journey
                </Typography>
                <Box sx={{ position: 'relative', mb: 4, px: { xs: 0, md: 4 } }}>
                  <Divider 
                    sx={{ 
                      my: 2,
                      position: 'absolute',
                      top: '50px',
                      width: '100%',
                      borderColor: '#008080',
                      borderWidth: '2px',
                      opacity: 0.4
                    }} 
                  />
                  <Grid container spacing={4} sx={{ position: 'relative' }}>
                    {mattressInfo.distributionChain.map((stage, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            position: 'relative'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 70, 
                              height: 70, 
                              borderRadius: '50%', 
                              background: 'linear-gradient(135deg, #008080 0%, #20B2AA 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              mb: 2,
                              zIndex: 2,
                              boxShadow: '0 8px 16px rgba(0,128,128,0.25)',
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              border: '3px solid white'
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              width: '100%',
                              textAlign: 'center',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'translateY(-5px)' }
                            }}
                          >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {stage.stage}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {stage.location}
                            </Typography>
                            <Chip
                              label={new Date(stage.date).toLocaleDateString()}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(0,128,128,0.1)',
                                color: '#006666',
                                fontWeight: 'medium',
                                mt: 1
                              }}
                            />
                          </Paper>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <StyledHeader>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <img 
              src={logoImage} 
              alt="MatCron Logo" 
              style={{ 
                height: 50, 
                filter: 'brightness(0) invert(1)'
              }} 
            />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Public Mattress Verification Portal
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Mattress Verification Portal
          </Typography>
          <Typography variant="subtitle1">
            Verify mattress details, certifications, and supply chain information
          </Typography>
        </Container>
      </StyledHeader>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {renderMattressInfo()}
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: '#1a2e35', 
        py: 5, 
        color: 'white',
        borderTop: '4px solid #008080'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img 
                  src={logoImage} 
                  alt="MatCron Logo" 
                  style={{ 
                    height: 40, 
                    filter: 'brightness(0) invert(1)',
                    marginRight: 16
                  }} 
                />
                <Typography variant="h6" fontWeight="bold">
                  MatCron
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                The leading mattress tracking system for sustainable and transparent supply chains.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © 2023 MatCron. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <List disablePadding>
                {['About Us', 'Our Services', 'Contact Support', 'FAQ'].map((item, index) => (
                  <ListItem 
                    key={index} 
                    disablePadding 
                    sx={{ 
                      mb: 1,
                      '&:hover': { color: '#20B2AA' }
                    }}
                  >
                    <Button
                      sx={{
                        color: 'white',
                        opacity: 0.8,
                        '&:hover': {
                          opacity: 1,
                          bgcolor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Legal
              </Typography>
              <List disablePadding>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance'].map((item, index) => (
                  <ListItem 
                    key={index} 
                    disablePadding 
                    sx={{ mb: 1 }}
                  >
                    <Button
                      sx={{
                        color: 'white',
                        opacity: 0.8,
                        '&:hover': {
                          opacity: 1,
                          bgcolor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default GuestPage; 