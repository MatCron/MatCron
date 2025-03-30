import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Divider,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Stack,
  styled,
  useTheme,
  Tabs,
  Tab,
  Fade,
  Zoom,
  Checkbox,
  Drawer
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Warning,
  Info,
  Close,
  FileUpload,
  DataObject,
  Save,
  Preview,
  Refresh,
  DownloadForOffline,
  History,
  FilterList,
  FileDownload,
  DeleteOutline,
  Analytics,
  AutoGraph,
  BatchPrediction,
  Settings,
  HelpOutline,
  Search
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ExtractionService from '../../services/ExtractionService';
import CustomSnackbar from '../../components/Snackbar';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { Link } from 'react-router-dom';

// Styled components for enhanced UI
const StyledUploadBox = styled(Paper)(({ theme, isDragActive }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '2px dashed',
  borderColor: isDragActive ? '#008080' : '#e2e8f0',
  backgroundColor: isDragActive ? 'rgba(0, 128, 128, 0.05)' : 'white',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#008080',
    backgroundColor: 'rgba(0, 128, 128, 0.05)'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  ...(variant === 'contained' && {
    backgroundColor: '#008080',
    '&:hover': {
      backgroundColor: '#006666',
    }
  }),
  ...(variant === 'outlined' && {
    borderColor: '#008080',
    color: '#008080',
    '&:hover': {
      borderColor: '#006666',
      backgroundColor: 'rgba(0,128,128,0.04)'
    }
  })
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.4)',
  padding: theme.spacing(3),
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  backgroundColor: `${color}20`,
  color: color,
  '& .MuiChip-label': {
    padding: '0 10px'
  }
}));

const ExtractionPage = () => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // New state variables for enhanced features
  const [activeTab, setActiveTab] = useState(0);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [fileType, setFileType] = useState('excel');
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    date: 'all'
  });
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [processingSettings, setProcessingSettings] = useState({
    validateOnly: false,
    autoProcess: true,
    notifyOnCompletion: true
  });
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [templates, setTemplates] = useState([
    { id: 'default', name: 'Default Template' },
    { id: 'simple', name: 'Simple Template' },
    { id: 'detailed', name: 'Detailed Template' }
  ]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setValidationResult(null);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Use mock service for demo
      const data = await ExtractionService.mockValidateFile(file);
      setValidationResult(data);
      
      setSnackbar({
        open: true,
        message: `File validated: ${data.validCount} valid rows, ${data.errorCount} errors`,
        severity: data.status === 'error' ? 'error' : (data.status === 'warning' ? 'warning' : 'success')
      });
    } catch (err) {
      setError(err.message || 'Upload failed');
      setSnackbar({
        open: true,
        message: err.message || 'Upload failed',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!validationResult?.isValid) return;

    setUploading(true);
    setError(null);

    try {
      // Use mock service for demo
      const result = await ExtractionService.mockSaveData();
      
      setSnackbar({
        open: true,
        message: result.message || 'Data saved successfully',
        severity: 'success'
      });

      // Reset form after successful save
      setFile(null);
      setValidationResult(null);
    } catch (err) {
      setError(err.message || 'Save failed');
      setSnackbar({
        open: true,
        message: err.message || 'Save failed',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getValidationStatusColor = (status) => {
    switch (status) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getValidationStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'warning':
        return <Warning sx={{ color: '#f59e0b' }} />;
      case 'error':
        return <Error sx={{ color: '#ef4444' }} />;
      default:
        return <Info sx={{ color: '#64748b' }} />;
    }
  };

  useEffect(() => {
    // Fetch mock upload history for demo
    const fetchHistory = async () => {
      try {
        const mockHistory = [
          {
            id: '1',
            filename: 'mattress_data_01.xlsx',
            date: '2023-08-15',
            status: 'success',
            recordsProcessed: 256,
            validRecords: 245,
            errors: 11
          },
          {
            id: '2',
            filename: 'inventory_update.xlsx',
            date: '2023-08-12',
            status: 'warning',
            recordsProcessed: 120,
            validRecords: 98,
            errors: 22
          },
          {
            id: '3',
            filename: 'new_products.xlsx',
            date: '2023-08-10',
            status: 'error',
            recordsProcessed: 75,
            validRecords: 42,
            errors: 33
          }
        ];
        setUploadHistory(mockHistory);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.value
    });
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const handleSettingsChange = (setting) => {
    setProcessingSettings({
      ...processingSettings,
      [setting]: !processingSettings[setting]
    });
  };

  const handleDownloadTemplate = () => {
    setSnackbar({
      open: true,
      message: `${selectedTemplate} template downloaded successfully`,
      severity: 'success'
    });
  };

  const generateStats = () => {
    return {
      totalUploads: uploadHistory.length,
      successRate: Math.round((uploadHistory.filter(item => item.status === 'success').length / uploadHistory.length) * 100),
      totalRecords: uploadHistory.reduce((sum, item) => sum + item.recordsProcessed, 0),
      averageErrorRate: Math.round(uploadHistory.reduce((sum, item) => sum + (item.errors / item.recordsProcessed), 0) / uploadHistory.length * 100)
    };
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        ml: { xs: 0, md: 9 }, 
        mt: 4,
        maxWidth: { sm: '100%', md: 1400 },
        mx: 'auto',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h4" fontWeight="bold" color="#1e293b" sx={{ mb: 1, textAlign: 'center' }}>
            Data Extraction
          </Typography>
          
          <Box 
            sx={{ 
              position: 'relative', 
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              "&::after": {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                bgcolor: '#e2e8f0'
              }
            }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: '16px 16px 0 0',
                width: 'fit-content',
                mx: 'auto',
                px: 1
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="standard"
                centered
                sx={{ 
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#008080',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  },
                  '& .Mui-selected': {
                    color: '#008080 !important',
                    fontWeight: 'bold'
                  },
                  '& .MuiTab-root': {
                    py: 2,
                    px: 4,
                    fontSize: '1.05rem',
                    transition: 'all 0.2s',
                    textTransform: 'none',
                    minWidth: { xs: 100, md: 150 },
                    '&:hover': {
                      color: '#008080'
                    }
                  }
                }}
              >
                <Tab 
                  icon={<CloudUpload sx={{ mb: 0.5 }} />} 
                  label="Upload" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<History sx={{ mb: 0.5 }} />} 
                  label="History" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<Analytics sx={{ mb: 0.5 }} />} 
                  label="Analytics" 
                  iconPosition="top"
                />
              </Tabs>
            </Paper>
          </Box>

          {/* Upload & Process Tab */}
          {activeTab === 0 && (
            <Fade in={activeTab === 0} timeout={500}>
              <div>
                <Grid container spacing={3}>
                  {/* Left side: Upload + Quick Stats */}
                  <Grid item xs={12} md={7}>
                    {/* Upload Card */}
                    <StyledCard 
                      sx={{ 
                        height: 'auto', 
                        mb: 3,
                        borderRadius: 3,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        overflow: 'hidden'
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: '#008080', 
                        color: 'white',
                        py: 1.5,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <CloudUpload sx={{ mr: 1.5, fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="bold">
                          Upload Files
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white', borderRadius: 1 }}>
                          <Select
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            size="small"
                            sx={{ 
                              color: '#008080',
                              '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '.MuiSelect-select': { py: 1 }
                            }}
                            displayEmpty
                          >
                            <MenuItem value="excel">Excel (.xlsx, .xls)</MenuItem>
                            <MenuItem value="csv">CSV (.csv)</MenuItem>
                            <MenuItem value="json">JSON (.json)</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <StyledUploadBox 
              {...getRootProps()}
                          isDragActive={isDragActive}
                          sx={{ 
                            transition: 'all 0.3s ease',
                            transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
                            boxShadow: isDragActive ? '0 8px 25px rgba(0, 128, 128, 0.15)' : 'none',
                          }}
            >
              <input {...getInputProps()} />
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                            py: 5
                          }}>
                            <CloudUpload sx={{ 
                              fontSize: 70, 
                              color: isDragActive ? '#008080' : '#90a4ae', 
                              mb: 2,
                              transition: 'all 0.3s ease'
                            }} />
                            <Typography variant="h6" gutterBottom color={isDragActive ? '#008080' : 'text.primary'}>
                              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                </Typography>
                            <Typography variant="body1" color="text.secondary" align="center">
                  or click to select a file
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                              {fileType === 'excel' ? 'Supported formats: .xlsx, .xls' : 
                               fileType === 'csv' ? 'Supported format: .csv' : 'Supported format: .json'}
                </Typography>
              </Box>
                        </StyledUploadBox>

            {file && (
              <Paper 
                elevation={0} 
                sx={{ 
                              mt: 3, 
                  p: 2, 
                  borderRadius: 2, 
                              bgcolor: 'rgba(0, 128, 128, 0.05)',
                              border: '1px solid rgba(0, 128, 128, 0.1)',
                              animation: 'fadeIn 0.5s ease-in-out'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FileUpload sx={{ color: '#008080', mr: 1.5, fontSize: 22 }} />
                    <Box>
                                  <Typography variant="subtitle1" fontWeight="medium">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => setFile(null)}
                                sx={{ 
                                  color: '#64748b',
                                  bgcolor: 'rgba(100, 116, 139, 0.1)',
                                  '&:hover': {
                                    bgcolor: 'rgba(100, 116, 139, 0.2)',
                                  }
                                }}
                              >
                                <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            )}

                        <Box sx={{ 
                          mt: 3, 
                          display: 'flex', 
                          gap: 2, 
                          flexWrap: 'wrap', 
                          justifyContent: 'center' 
                        }}>
                          <StyledButton
                variant="contained"
                            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <DataObject />}
                onClick={handleUpload}
                disabled={!file || uploading}
                            sx={{ minWidth: 150 }}
                          >
                            {uploading ? 'Processing...' : 'Validate Data'}
                          </StyledButton>
                          <StyledButton
                            variant={validationResult?.isValid ? "contained" : "outlined"}
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={!validationResult?.isValid || uploading}
                            color={validationResult?.isValid ? "primary" : "inherit"}
                            sx={{ minWidth: 150 }}
                          >
                            Save & Process
                          </StyledButton>
                          <StyledButton
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setFile(null);
                  setValidationResult(null);
                  setError(null);
                }}
                disabled={uploading}
                            size="medium"
              >
                Reset
                          </StyledButton>
            </Box>
                      </CardContent>

            {error && (
              <Alert 
                severity="error" 
                          sx={{ mx: 3, mb: 3, borderRadius: 2 }}
                onClose={() => setError(null)}
                          variant="filled"
              >
                {error}
              </Alert>
            )}
                    </StyledCard>

                    {/* Validation Results (only if validation data exists) */}
            {validationResult && (
                      <StyledCard 
                sx={{ 
                          height: 'auto',
                          borderRadius: 3,
                          overflow: 'hidden',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                        }}
                      >
                        <Box 
                          sx={{ 
                            bgcolor: getValidationStatusColor(validationResult.status),
                            color: 'white',
                            py: 1.5,
                            px: 3,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                  {getValidationStatusIcon(validationResult.status)}
                          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1.5 }}>
                    Validation Results
                  </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          <Typography variant="subtitle2">
                      {validationResult.validCount}/{validationResult.totalCount} rows valid
                    </Typography>
                  </Box>
                        
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(validationResult.validCount / validationResult.totalCount) * 100}
                    sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              mb: 3,
                              bgcolor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getValidationStatusColor(validationResult.status)
                      }
                    }}
                  />
                          
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Paper sx={{ 
                                p: 2, 
                                textAlign: 'center', 
                                borderRadius: 2, 
                                bgcolor: 'rgba(16, 185, 129, 0.08)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid rgba(16, 185, 129, 0.2)'
                              }}>
                                <CheckCircle sx={{ color: '#10b981', fontSize: 36, mb: 1 }} />
                                <Typography variant="body2" color="text.secondary" gutterBottom>Valid</Typography>
                                <Typography variant="h5" fontWeight="bold">{validationResult.validCount}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={4}>
                              <Paper sx={{ 
                                p: 2, 
                                textAlign: 'center', 
                                borderRadius: 2, 
                                bgcolor: 'rgba(245, 158, 11, 0.08)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid rgba(245, 158, 11, 0.2)'
                              }}>
                                <Warning sx={{ color: '#f59e0b', fontSize: 36, mb: 1 }} />
                                <Typography variant="body2" color="text.secondary" gutterBottom>Warnings</Typography>
                                <Typography variant="h5" fontWeight="bold">{validationResult.warningCount}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={4}>
                              <Paper sx={{ 
                                p: 2, 
                                textAlign: 'center', 
                                borderRadius: 2, 
                                bgcolor: 'rgba(239, 68, 68, 0.08)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                              }}>
                                <Error sx={{ color: '#ef4444', fontSize: 36, mb: 1 }} />
                                <Typography variant="body2" color="text.secondary" gutterBottom>Errors</Typography>
                                <Typography variant="h5" fontWeight="bold">{validationResult.errorCount}</Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ 
                            mt: 3,
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: 'rgba(59, 130, 246, 0.05)',
                            border: '1px solid rgba(59, 130, 246, 0.15)'
                          }}>
                            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                              Processing Recommendation
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {validationResult.status === 'success' 
                                ? 'Your data is valid and ready to be processed. Proceed with saving the data.' 
                                : validationResult.status === 'warning'
                                ? 'Your data has warnings but can still be processed. Review details before saving.'
                                : 'Your data has errors that need to be fixed before it can be processed.'}
                            </Typography>
                </Box>

                          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <StyledButton
                              variant="outlined"
                              startIcon={<Preview />}
                              onClick={() => setPreviewOpen(true)}
                              sx={{ minWidth: 130 }}
                            >
                              View Details
                            </StyledButton>
                            
                            <StyledButton
                              variant="outlined"
                              startIcon={<FileDownload />}
                              disabled={!validationResult.isValid}
                              onClick={() => {
                                setSnackbar({
                                  open: true,
                                  message: 'Report downloaded successfully',
                                  severity: 'success'
                                });
                              }}
                              sx={{ minWidth: 130 }}
                            >
                              Download
                            </StyledButton>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    )}
                  </Grid>

                  {/* Right side: Processing Options */}
                  <Grid item xs={12} md={5}>
                    <StyledCard sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        bgcolor: '#64748b', 
                        color: 'white',
                        py: 1.5,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Settings sx={{ mr: 1.5, fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="bold">
                          Processing Options
                        </Typography>
                      </Box>
                      
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ ml: 1 }}>
                            Template Selection
                          </Typography>
                          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
                            <Select
                              value={selectedTemplate}
                              onChange={handleTemplateChange}
                              size="small"
                              displayEmpty
                              sx={{ 
                                borderRadius: 2,
                                '.MuiSelect-select': { py: 1.5 },
                                bgcolor: 'rgba(100, 116, 139, 0.06)'
                              }}
                            >
                              {templates.map(template => (
                                <MenuItem key={template.id} value={template.id}>
                                  {template.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            mt: 1
                          }}>
                            <Tooltip title="Download template file">
                              <StyledButton
                                variant="outlined"
                                startIcon={<DownloadForOffline />}
                                onClick={handleDownloadTemplate}
                                size="small"
                                color="inherit"
                                sx={{ 
                                  color: '#64748b', 
                                  borderColor: '#64748b',
                                  '&:hover': {
                                    borderColor: '#64748b',
                                    bgcolor: 'rgba(100, 116, 139, 0.08)'
                                  }
                                }}
                              >
                                Download Template
                              </StyledButton>
                            </Tooltip>
                            
                            <Tooltip title="View Documentation">
                              <IconButton 
                                onClick={() => setHelpDialogOpen(true)}
                                size="small"
                                sx={{ 
                                  color: '#64748b',
                                  bgcolor: 'rgba(100, 116, 139, 0.08)',
                                  '&:hover': {
                                    bgcolor: 'rgba(100, 116, 139, 0.15)',
                                  }
                                }}
                              >
                                <HelpOutline fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ ml: 1 }}>
                          Processing Settings
                        </Typography>
                        <Paper sx={{ 
                          borderRadius: 2,
                          mb: 3,
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}>
                          <List disablePadding>
                            <ListItem 
                              disablePadding 
                              sx={{ 
                                py: 1.2, 
                                px: 2,
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 42 }}>
                                <Checkbox 
                                  checked={processingSettings.validateOnly} 
                                  onChange={() => handleSettingsChange('validateOnly')}
                                  size="small"
                                  sx={{ color: '#64748b', '&.Mui-checked': { color: '#64748b' } }}
                                />
                    </ListItemIcon>
                    <ListItemText 
                                primary="Validate Only" 
                                secondary="Don't save data after validation"
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                            <ListItem 
                              disablePadding 
                              sx={{ 
                                py: 1.2, 
                                px: 2,
                                borderBottom: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 42 }}>
                                <Checkbox 
                                  checked={processingSettings.autoProcess} 
                                  onChange={() => handleSettingsChange('autoProcess')}
                                  size="small"
                                  sx={{ color: '#64748b', '&.Mui-checked': { color: '#64748b' } }}
                                />
                    </ListItemIcon>
                    <ListItemText 
                                primary="Auto-Process" 
                                secondary="Start validation immediately after upload"
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                            <ListItem 
                              disablePadding 
                              sx={{ 
                                py: 1.2, 
                                px: 2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 42 }}>
                                <Checkbox 
                                  checked={processingSettings.notifyOnCompletion} 
                                  onChange={() => handleSettingsChange('notifyOnCompletion')}
                                  size="small"
                                  sx={{ color: '#64748b', '&.Mui-checked': { color: '#64748b' } }}
                                />
                    </ListItemIcon>
                    <ListItemText 
                                primary="Notify on Completion" 
                                secondary="Send notification when processing completes"
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
                        </Paper>
                        
                        {validationResult && (
                          <>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ ml: 1 }}>
                              Data Insights
                            </Typography>
                            <Stack spacing={2.5} sx={{ mt: 2 }}>
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle sx={{ fontSize: 16, color: '#10b981', mr: 1 }} />
                                    Valid Records
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">{validationResult.validCount}</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(validationResult.validCount / validationResult.totalCount) * 100}
                    sx={{ 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: '#10b981'
                                    }
                                  }}
                                />
                              </Box>
                              
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Warning sx={{ fontSize: 16, color: '#f59e0b', mr: 1 }} />
                                    Warnings
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">{validationResult.warningCount}</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(validationResult.warningCount / validationResult.totalCount) * 100}
                    sx={{ 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: '#f59e0b'
                                    }
                                  }}
                                />
                              </Box>
                              
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Error sx={{ fontSize: 16, color: '#ef4444', mr: 1 }} />
                                    Errors
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">{validationResult.errorCount}</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(validationResult.errorCount / validationResult.totalCount) * 100}
                                  sx={{ 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: '#ef4444'
                                    }
                                  }}
                                />
                              </Box>
                            </Stack>
                          </>
                        )}
                        
                        {!validationResult && (
                          <Box sx={{ 
                            mt: 4,
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 128, 128, 0.05)',
                            border: '1px dashed rgba(0, 128, 128, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <CloudUpload sx={{ color: '#90a4ae', fontSize: 40, mb: 2 }} />
                            <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                              Upload a file to begin the process
                            </Typography>
                            <Typography variant="caption" align="center" color="text.secondary">
                              Validation results will appear here
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              </div>
            </Fade>
          )}

          {/* Upload History Tab */}
          {activeTab === 1 && (
            <Fade in={activeTab === 1} timeout={500}>
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                            <History sx={{ mr: 1, color: '#008080' }} />
                            Upload History
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel id="status-filter-label">Status</InputLabel>
                              <Select
                                labelId="status-filter-label"
                                name="status"
                                value={filterOptions.status}
                                onChange={handleFilterChange}
                                label="Status"
                                size="small"
                              >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="success">Success</MenuItem>
                                <MenuItem value="warning">Warning</MenuItem>
                                <MenuItem value="error">Error</MenuItem>
                              </Select>
                            </FormControl>
                            
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel id="date-filter-label">Date</InputLabel>
                              <Select
                                labelId="date-filter-label"
                                name="date"
                                value={filterOptions.date}
                                onChange={handleFilterChange}
                                label="Date"
                                size="small"
                              >
                                <MenuItem value="all">All Time</MenuItem>
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="week">This Week</MenuItem>
                                <MenuItem value="month">This Month</MenuItem>
                              </Select>
                            </FormControl>
                            
                            <Tooltip title="Apply Filters">
                              <IconButton sx={{ color: '#008080' }}>
                                <FilterList />
                              </IconButton>
                            </Tooltip>
                </Box>
                        </Box>
                        
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Filename</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Records</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Valid</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Errors</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {uploadHistory.map((item) => (
                                <TableRow key={item.id} hover>
                                  <TableCell>{item.filename}</TableCell>
                                  <TableCell>{item.date}</TableCell>
                                  <TableCell>
                                    <StyledChip 
                                      label={item.status} 
                                      size="small"
                                      color={getValidationStatusColor(item.status)}
                                    />
                                  </TableCell>
                                  <TableCell>{item.recordsProcessed}</TableCell>
                                  <TableCell>{item.validRecords}</TableCell>
                                  <TableCell>{item.errors}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <Tooltip title="Download Report">
                                        <IconButton size="small" sx={{ color: '#008080' }}>
                                          <FileDownload fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="View Details">
                                        <IconButton size="small" sx={{ color: '#008080' }}>
                                          <Preview fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete">
                                        <IconButton size="small" sx={{ color: '#ef4444' }}>
                                          <DeleteOutline fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              </div>
            </Fade>
          )}

          {/* Analytics & Reports Tab */}
          {activeTab === 2 && (
            <Fade in={activeTab === 2} timeout={500}>
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Analytics sx={{ mr: 1, color: '#008080' }} />
                          Process Analytics
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(0, 128, 128, 0.1)',
                                height: '100%',
                                textAlign: 'center'
                              }}
                            >
                              <BatchPrediction sx={{ fontSize: 40, color: '#008080', mb: 1 }} />
                              <Typography variant="h5" fontWeight="bold">
                                {generateStats().totalUploads}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Uploads
                              </Typography>
              </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                height: '100%',
                                textAlign: 'center'
                              }}
                            >
                              <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                              <Typography variant="h5" fontWeight="bold">
                                {generateStats().successRate}%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Success Rate
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                height: '100%',
                                textAlign: 'center'
                              }}
                            >
                              <DataObject sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                              <Typography variant="h5" fontWeight="bold">
                                {generateStats().totalRecords}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Records
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: 2, 
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                height: '100%',
                                textAlign: 'center'
                              }}
                            >
                              <Error sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
                              <Typography variant="h5" fontWeight="bold">
                                {generateStats().averageErrorRate}%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Avg. Error Rate
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4, mb: 2 }}>
                          Recent Activity Summary
                        </Typography>
                        
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                          <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Period</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Files Processed</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total Records</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Success Rate</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Error Rate</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow hover>
                                <TableCell>Today</TableCell>
                                <TableCell>1</TableCell>
                                <TableCell>256</TableCell>
                                <TableCell>95.7%</TableCell>
                                <TableCell>4.3%</TableCell>
                              </TableRow>
                              <TableRow hover>
                                <TableCell>This Week</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>451</TableCell>
                                <TableCell>85.4%</TableCell>
                                <TableCell>14.6%</TableCell>
                              </TableRow>
                              <TableRow hover>
                                <TableCell>This Month</TableCell>
                                <TableCell>12</TableCell>
                                <TableCell>1,245</TableCell>
                                <TableCell>89.2%</TableCell>
                                <TableCell>10.8%</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <StyledButton
                            variant="contained"
                            startIcon={<FileDownload />}
                            onClick={() => {
                              setSnackbar({
                                open: true,
                                message: 'Analytics report downloaded successfully',
                                severity: 'success'
                              });
                            }}
                          >
                            Export Analytics
                          </StyledButton>
                          <StyledButton
                            variant="outlined"
                            startIcon={<AutoGraph />}
                            onClick={() => setShowStats(!showStats)}
                          >
                            {showStats ? 'Hide' : 'Show'} Detailed Charts
                          </StyledButton>
                        </Box>
                        
                        {showStats && (
                          <Box sx={{ mt: 3, p: 3, border: '1px dashed #e2e8f0', borderRadius: 2 }}>
                            <Typography variant="body1" align="center" color="text.secondary">
                              Detailed analytics charts would be displayed here.
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </StyledCard>
          </Grid>
        </Grid>
              </div>
            </Fade>
          )}
        </Box>
      </Box>

        {/* Loading Overlay */}
        {uploading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              backdropFilter: 'blur(4px)'
            }}
          >
          <Zoom in={uploading}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '90%',
                width: 300,
              }}
            >
              <CircularProgress size={60} sx={{ color: '#008080', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Processing...
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Please wait while we process your file. This may take a moment.
              </Typography>
              <LinearProgress 
                sx={{ 
                  mt: 3, 
                  width: '100%', 
                  height: 6, 
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#008080'
                  }
                }} 
              />
            </Paper>
          </Zoom>
          </Box>
        )}

      {/* Convert Preview Dialog to Side Drawer */}
      <Drawer 
        anchor="right" 
          open={previewOpen} 
          onClose={() => setPreviewOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 500, md: 600 },
            maxWidth: '100%',
            boxSizing: 'border-box',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
            borderRadius: 0
          }
        }}
      >
        <Box sx={{ 
            bgcolor: '#008080', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Preview sx={{ mr: 1.5 }} />
            <Typography variant="h6" fontWeight="bold">
              Data Preview & Validation Results
            </Typography>
            </Box>
            <IconButton onClick={() => setPreviewOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
        </Box>
        
        <Box sx={{ p: 3, overflowY: 'auto', height: 'calc(100% - 64px)' }}>
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity={validationResult?.status === 'error' ? 'error' : (validationResult?.status === 'warning' ? 'warning' : 'success')}
              variant="outlined"
              icon={getValidationStatusIcon(validationResult?.status)}
              sx={{ borderRadius: 2 }}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>
                {validationResult?.status === 'error' 
                  ? 'Validation Failed' 
                  : (validationResult?.status === 'warning' 
                    ? 'Validation Completed with Warnings' 
                    : 'Validation Successful')}
              </AlertTitle>
              {validationResult?.status === 'error' 
                ? `Found ${validationResult?.errorCount} errors that need to be fixed.` 
                : (validationResult?.status === 'warning' 
                  ? `${validationResult?.warningCount} warnings detected, but data can still be processed.` 
                  : 'All records have been validated successfully.')}
            </Alert>
          </Box>
          
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Data Records</Typography>
            <TextField
              placeholder="Search records..."
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: <Search sx={{ color: '#64748b', mr: 1 }} />,
              }}
              sx={{ width: 250 }}
            />
          </Box>
          
          <TableContainer sx={{ maxHeight: 400, mb: 2 }}>
            <Table stickyHeader>
                <TableHead>
                  <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Row</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mattress ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>EPC Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validationResult?.rows.map((row, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      bgcolor: row.status === 'error' 
                        ? 'rgba(239, 68, 68, 0.05)' 
                        : (row.status === 'warning' 
                          ? 'rgba(245, 158, 11, 0.05)' 
                          : 'inherit')
                    }}
                  >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.mattressId}</TableCell>
                      <TableCell>
                      <Tooltip title="Copy to clipboard">
                        <Box
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(row.epcCode);
                            setSnackbar({
                              open: true,
                              message: 'EPC Code copied to clipboard',
                              severity: 'success'
                            });
                          }}
                        >
                          {row.epcCode}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <StyledChip 
                        label={row.status}
                        size="small"
                        color={getValidationStatusColor(row.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {row.message && (
                          <Typography variant="body2" color="text.secondary">
                            {row.message}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {validationResult?.rows?.length || 0} of {validationResult?.totalCount || 0} records
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Filter by status">
                <IconButton size="small" sx={{ color: '#008080' }}>
                  <FilterList fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download as CSV">
                <IconButton size="small" sx={{ color: '#008080' }}>
                  <FileDownload fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {validationResult?.isValid && (
              <StyledButton 
                variant="contained"
                startIcon={<Save />}
                onClick={() => {
                  setPreviewOpen(false);
                  handleSave();
                }}
              >
                Save Data
              </StyledButton>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#008080', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutline sx={{ mr: 1.5 }} />
            Data Extraction Help Guide
          </Box>
          <IconButton onClick={() => setHelpDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>File Format Requirements</Typography>
          <Typography variant="body2" paragraph>
            The data extraction tool accepts Excel files (.xlsx, .xls) containing mattress information. The file should include the following columns:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li">
              <Typography variant="body2">
                <strong>Mattress ID</strong> - A unique identifier for each mattress
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body2">
                <strong>EPC Code</strong> - The Electronic Product Code associated with the mattress
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Processing Steps</Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Box component="li">
              <Typography variant="body2" paragraph>
                <strong>Upload File</strong> - Drag and drop or select an Excel file from your computer.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body2" paragraph>
                <strong>Validate Data</strong> - The system will check the file format and data validity.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body2" paragraph>
                <strong>Review Results</strong> - Examine the validation results to identify any issues.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body2">
                <strong>Save Data</strong> - Once validated, save the data to the system.
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Common Errors</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Error Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>How to Fix</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Missing ID</TableCell>
                  <TableCell>Mattress ID is missing</TableCell>
                  <TableCell>Ensure all rows have a valid mattress ID</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Invalid EPC</TableCell>
                  <TableCell>EPC code format is incorrect</TableCell>
                  <TableCell>Verify EPC codes follow the required format</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Duplicate Entry</TableCell>
                  <TableCell>Mattress ID or EPC already exists</TableCell>
                  <TableCell>Remove or update duplicate entries</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <StyledButton 
            variant="contained"
            onClick={() => setHelpDialogOpen(false)}
          >
            Got It
          </StyledButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <CustomSnackbar
          open={snackbar.open}
          handleClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
    </>
  );
};

export default ExtractionPage; 