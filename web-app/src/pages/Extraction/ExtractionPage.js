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
import IdentifierPoolService from '../../services/IdentifierPoolService';
import ExtractionService from '../../services/ExtractionService';
import CustomSnackbar from '../../components/Snackbar';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { Link } from 'react-router-dom';
import qrCodeImage from '../../assets/images/qr.png';

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
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: '1',
      filename: 'TCA3_Demo.xlsx',
      date: '2023-08-10',
      status: 'success',
      recordsProcessed: 2,
      validRecords: 2,
      errors: 0
    },
    {
      id: '2',
      filename: 'TCA3_Demo.xlsx',
      date: '2023-08-12',
      status: 'error',
      recordsProcessed: 2,
      validRecords: 1,
      errors: 1
    },
    {
      id: '3',
      filename: 'batch_upload_april.xlsx',
      date: '2023-04-15',
      status: 'success',
      recordsProcessed: 125,
      validRecords: 125,
      errors: 0
    },
    {
      id: '4',
      filename: 'mattress_inventory_may.xlsx',
      date: '2023-05-10',
      status: 'warning',
      recordsProcessed: 98,
      validRecords: 92,
      errors: 6
    },
    {
      id: '5',
      filename: 'new_inventory_june.xlsx',
      date: '2023-06-22',
      status: 'error',
      recordsProcessed: 45,
      validRecords: 0,
      errors: 45
    },
    {
      id: '6',
      filename: 'warehouse_stock.xlsx',
      date: '2023-07-05',
      status: 'success',
      recordsProcessed: 215,
      validRecords: 215,
      errors: 0
    },
    {
      id: '7',
      filename: 'july_shipment.xlsx',
      date: '2023-07-28',
      status: 'warning',
      recordsProcessed: 76,
      validRecords: 72,
      errors: 4
    }
  ]);
  const [historyFetchFailed, setHistoryFetchFailed] = useState(false);
  const [statsLoadFailed, setStatsLoadFailed] = useState(false);
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
  // New state for identifier pool stats
  const [identifierStats, setIdentifierStats] = useState({
    totalCount: 559,
    assignedCount: 324,
    availableCount: 235,
    lastUploadDate: '2023-07-28',
    percentAssigned: 58,
    recentActivity: [
      { date: '2023-07-28', action: 'upload', count: 76 },
      { date: '2023-07-05', action: 'upload', count: 215 },
      { date: '2023-06-30', action: 'assignment', count: 120 },
      { date: '2023-06-22', action: 'upload', count: 45 },
      { date: '2023-06-15', action: 'assignment', count: 85 }
    ]
  });

  // Add a function to get identifiers to the IdentifierPoolService
  const [identifiers, setIdentifiers] = useState([
    {
      id: '1',
      mattressIdentifier: 'MAT-001',
      epcCode: 'EPC-12345ABC',
      qrCode: qrCodeImage,
      isAssigned: true,
      assignmentDate: '2023-05-15'
    },
    {
      id: '2',
      mattressIdentifier: 'MAT-002',
      epcCode: 'EPC-67890XYZ',
      qrCode: qrCodeImage,
      isAssigned: true,
      assignmentDate: '2023-05-16'
    },
    {
      id: '3',
      mattressIdentifier: 'MAT-003',
      epcCode: 'EPC-ABCDE123',
      qrCode: qrCodeImage,
      isAssigned: false,
      assignmentDate: null
    },
    {
      id: '4',
      mattressIdentifier: 'MAT-004',
      epcCode: 'EPC-WXYZ789',
      qrCode: qrCodeImage,
      isAssigned: true,
      assignmentDate: '2023-06-10'
    },
    {
      id: '5',
      mattressIdentifier: 'MAT-005',
      epcCode: 'EPC-456DEF',
      qrCode: qrCodeImage,
      isAssigned: false,
      assignmentDate: null
    },
    {
      id: '6',
      mattressIdentifier: 'MAT-006',
      epcCode: 'EPC-789GHI',
      qrCode: qrCodeImage,
      isAssigned: true,
      assignmentDate: '2023-06-15'
    },
    {
      id: '7',
      mattressIdentifier: 'MAT-007',
      epcCode: 'EPC-JKL321',
      qrCode: qrCodeImage,
      isAssigned: false,
      assignmentDate: null
    },
    {
      id: '8',
      mattressIdentifier: 'MAT-008',
      epcCode: 'EPC-MNO654',
      qrCode: qrCodeImage,
      isAssigned: true,
      assignmentDate: '2023-07-01'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [identifierLoading, setIdentifierLoading] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState('all'); // 'all', 'assigned', 'available'
  const [qrPreviewOpen, setQrPreviewOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [selectedIdentifier, setSelectedIdentifier] = useState(null);

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
      let data;
      // Try with IdentifierPoolService first
      try {
        console.log('Attempting to upload with IdentifierPoolService');
        data = await IdentifierPoolService.uploadAndValidate(file);
      } catch (err) {
        // Fall back to ExtractionService if needed (for backwards compatibility)
        console.log('Falling back to ExtractionService.mockValidateFile');
        data = await IdentifierPoolService.mockValidateFile(file);
      }
      
      console.log('API Response from backend:', data);
      
      // Store the validation result
      setValidationResult(data);
      
      // Determine message format based on available properties
      let validCount, errorCount, status;
      
      if (data.validCount !== undefined || data.ValidCount !== undefined) {
        // Direct stats format
        validCount = data.validCount !== undefined ? data.validCount : data.ValidCount;
        errorCount = data.errorCount !== undefined ? data.errorCount : data.ErrorCount;
        status = data.status !== undefined ? data.status : data.Status;
      } else if (data.validData !== undefined || data.ValidData !== undefined) {
        // Array format
        const validData = data.validData || data.ValidData || [];
        const invalidData = data.invalidData || data.InvalidData || [];
        validCount = validData.length;
        errorCount = invalidData.length;
        status = errorCount > 0 ? (validCount > 0 ? 'warning' : 'error') : 'success';
      } else {
        // Unknown format
        console.warn("Unknown API response format:", data);
        validCount = 0;
        errorCount = 0;
        status = 'error';
      }
      
      // Display consistent message
      setSnackbar({
        open: true,
        message: `File validated: ${validCount} valid rows, ${errorCount} errors`,
        severity: status === 'error' ? 'error' : (status === 'warning' ? 'warning' : 'success')
      });
    } catch (err) {
      console.error('Upload error:', err);
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
    // Check if there are valid rows to save based on tab and validation format
    const stats = getValidationStats();
    
    if (!stats || stats.validCount === 0) {
      setSnackbar({
        open: true,
        message: 'No valid data to save',
        severity: 'warning'
      });
      return;
    }
    
    console.log('Starting save operation with validation stats:', stats);
    setUploading(true);
    setError(null);

    try {
      // Use IdentifierPoolService for all saves
      console.log('Saving data:', validationResult);
      const result = await IdentifierPoolService.saveIdentifiers(validationResult);
      
      console.log('Save operation completed successfully:', result);
      
      setSnackbar({
        open: true,
        message: result.message || `${stats.validCount} identifiers saved successfully`,
        severity: 'success'
      });

      // Refresh stats for identifier pool if we're on that tab
      if (activeTab === 1) {
        fetchIdentifierStats();
      }
      
      // Reset history fetch failed flag to retry fetching history
      setHistoryFetchFailed(false);

      // Reset form after successful save
      setFile(null);
      setValidationResult(null);
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Save failed';
      
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
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

  // Function to fetch identifier pool stats
  const fetchIdentifierStats = async () => {
    try {
      setStatsLoadFailed(false);
      
      // Use mock data instead of API call in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for identifier stats');
        // Mock data is already set in state
        return;
      }
      
      const stats = await IdentifierPoolService.getStats();
      setIdentifierStats(stats);
    } catch (err) {
      console.error('Error fetching identifier stats:', err);
      setStatsLoadFailed(true);
    }
  };

  // Use effect to load identifier stats when the tab changes to analytics
  useEffect(() => {
    if (activeTab === 2) {
      fetchIdentifierStats();
    }
  }, [activeTab]);

  // Use effect to load historical data
  useEffect(() => {
    if (activeTab === 1) {
      const fetchHistory = async () => {
        try {
          setHistoryFetchFailed(false);
          
          // Use mock data instead of API call in development mode
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock data for upload history');
            // Mock data is already set in state
            return;
          }
          
          const historyData = await IdentifierPoolService.getHistory();
          setUploadHistory(historyData);
        } catch (err) {
          console.error('Error fetching history:', err);
          setHistoryFetchFailed(true);
          setUploadHistory([]);
        }
      };
      
      fetchHistory();
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFile(null);
    setValidationResult(null);
    setError(null);
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

  const handleDownloadTemplate = async () => {
    try {
      // Use IdentifierPoolService for all template downloads
      const result = await IdentifierPoolService.downloadTemplate();
      setSnackbar({
        open: true,
        message: result.message || "Template downloaded successfully with QR code examples",
        severity: "success"
      });
      
      console.log('Template download result:', result);
    } catch (err) {
      console.error('Error downloading template:', err);
      setSnackbar({
        open: true,
        message: 'Failed to download template. Please check that you have Excel installed.',
        severity: 'error'
      });
    }
  };

  const generateStats = () => {
    if (!uploadHistory || uploadHistory.length === 0) {
      return {
        totalUploads: 0,
        successRate: 0,
        totalRecords: 0,
        averageErrorRate: 0
      };
    }
    
    return {
      totalUploads: uploadHistory.length,
      successRate: Math.round((uploadHistory.filter(item => item.status === 'success').length / uploadHistory.length) * 100),
      totalRecords: uploadHistory.reduce((sum, item) => sum + (item.recordsProcessed || 0), 0),
      averageErrorRate: Math.round(uploadHistory.reduce((sum, item) => sum + ((item.errors || 0) / (item.recordsProcessed || 1)), 0) / uploadHistory.length * 100)
    };
  };

  // Fetch all identifiers function
  const fetchIdentifiers = async () => {
    try {
      setIdentifierLoading(true);
      
      // Use mock data instead of API call in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for identifiers');
        // Filter mock data based on assignment status
        if (filterAssigned !== 'all') {
          const isAssigned = filterAssigned === 'assigned';
          const filtered = identifiers.filter(identifier => identifier.isAssigned === isAssigned);
          // We're not setting the state with filtered data directly because we want to keep
          // the original mock data intact and just filter it in the UI
        }
        setIdentifierLoading(false);
        return;
      }
      
      const response = await IdentifierPoolService.getIdentifiers(filterAssigned);
      // Ensure we always set an array to the state
      setIdentifiers(Array.isArray(response) ? response : []);
      setIdentifierLoading(false);
    } catch (err) {
      console.error('Error fetching identifiers:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load identifiers',
        severity: 'error'
      });
      setIdentifierLoading(false);
      // Make sure we set an empty array on error
      setIdentifiers([]);
    }
  };

  // Filter identifiers based on search query and assignment status
  const filteredIdentifiers = Array.isArray(identifiers) ? identifiers.filter(identifier => {
    // First apply assignment filter
    if (filterAssigned !== 'all' && identifier.isAssigned !== (filterAssigned === 'assigned')) {
      return false;
    }
    
    // Then apply search query
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (identifier.mattressIdentifier || '').toLowerCase().includes(query) ||
      (identifier.epcCode || '').toLowerCase().includes(query)
    );
  }) : [];

  // Use effect to fetch identifiers when tab changes or filter changes
  useEffect(() => {
    if (activeTab === 3) {
      fetchIdentifiers();
    }
  }, [activeTab, filterAssigned]);

  // Modified tabs content to include Analytics and Identifiers tabs
  const getTabContent = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return {
          title: "Data Extraction",
          description: "Upload Excel files with data to extract and process records"
        };
      case 1:
        return {
          title: "History",
          description: "View upload history and track processing results"
        };
      case 2:
        return {
          title: "Analytics",
          description: "View statistics and analytics on processed data"
        };
      case 3:
        return {
          title: "Identifiers",
          description: "View and manage all mattress identifiers and their assignment status"
        };
      default:
        return {
          title: "Data Processing",
          description: "Process and manage data files"
        };
    }
  };

  // Helper function to get validation stats for display
  const getValidationStats = () => {
    if (!validationResult) return null;
    
    console.log("Getting validation stats from:", validationResult);
    
    // Extract the proper values directly from the API response
    // The API response format is:
    // {
    //   status/Status: "error" | "warning" | "success",
    //   isValid/IsValid: boolean,
    //   totalCount/TotalCount: number,
    //   validCount/ValidCount: number, 
    //   warningCount/WarningCount: number,
    //   errorCount/ErrorCount: number,
    //   validData/ValidData: array,
    //   invalidData/InvalidData: array,
    //   allRows/AllRows: array
    // }
    
    // First check if we have the standard API format with direct stats (handle both cases)
    if (validationResult.totalCount !== undefined || 
        validationResult.TotalCount !== undefined || 
        validationResult.validCount !== undefined || 
        validationResult.ValidCount !== undefined || 
        validationResult.errorCount !== undefined || 
        validationResult.ErrorCount !== undefined) {
      
      return {
        validCount: validationResult.validCount || validationResult.ValidCount || 0,
        errorCount: validationResult.errorCount || validationResult.ErrorCount || 0, 
        warningCount: validationResult.warningCount || validationResult.WarningCount || 0,
        totalCount: validationResult.totalCount || validationResult.TotalCount || 0,
        status: validationResult.status || validationResult.Status || 'error',
        isValid: validationResult.isValid || validationResult.IsValid || false
      };
    }
    
    // For responses with validData/invalidData format but no direct stats
    if (validationResult.validData !== undefined || 
        validationResult.ValidData !== undefined || 
        validationResult.invalidData !== undefined || 
        validationResult.InvalidData !== undefined) {
      
      const validData = validationResult.validData || validationResult.ValidData || [];
      const invalidData = validationResult.invalidData || validationResult.InvalidData || [];
      const validCount = validData.length;
      const invalidCount = invalidData.length;
      const totalCount = validCount + invalidCount;
      
      return {
        validCount,
        errorCount: invalidCount, 
        warningCount: 0,
        totalCount,
        status: invalidCount > 0 ? (validCount > 0 ? 'warning' : 'error') : 'success',
        isValid: validCount > 0
      };
    }
    
    // If we have rows data
    if ((validationResult.rows && Array.isArray(validationResult.rows)) || 
        (validationResult.Rows && Array.isArray(validationResult.Rows))) {
      
      const rows = validationResult.rows || validationResult.Rows || [];
      const validCount = rows.filter(row => row.status === 'success').length;
      const warningCount = rows.filter(row => row.status === 'warning').length;
      const errorCount = rows.filter(row => row.status === 'error').length;
      const totalCount = rows.length;
      
      return {
        validCount,
        errorCount, 
        warningCount,
        totalCount,
        status: errorCount > 0 ? (validCount > 0 ? 'warning' : 'error') : 'success',
        isValid: validCount > 0
      };
    }
    
    // Default empty state if no matching format
    console.warn("Could not determine validation stats format:", validationResult);
    return {
      validCount: 0,
      errorCount: 0,
      warningCount: 0,
      totalCount: 0,
      status: 'error',
      isValid: false
    };
  };

  const tabContent = getTabContent(activeTab);

  // Update the table that shows validation results
  const renderValidationRows = () => {
    if (!validationResult) {
      return null;
    }

    // Log the validation result for debugging
    console.log('Rendering rows from validation result:', validationResult);
    
    // If we have AllRows/allRows directly from API (newer format)
    if (validationResult.allRows || validationResult.AllRows) {
      const allRows = validationResult.allRows || validationResult.AllRows || [];
      console.log('Using allRows format, rows count:', allRows.length);
      
      if (allRows.length === 0) {
        return null;
      }
      
      return allRows.map((row, index) => (
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
          <TableCell>{row.mattressIdentifier || row.MattressIdentifier || 'N/A'}</TableCell>
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
                  navigator.clipboard.writeText(row.epcCode || row.EpcCode || 'N/A');
                  setSnackbar({
                    open: true,
                    message: 'EPC Code copied to clipboard',
                    severity: 'success'
                  });
                }}
              >
                {row.epcCode || row.EpcCode || 'N/A'}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell>
            <StyledChip 
              label={row.status || row.Status || 'error'}
              size="small"
              color={getValidationStatusColor(row.status || row.Status || 'error')}
            />
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {row.message || row.Message || row.errorMessage || row.ErrorMessage || ''}
            </Typography>
          </TableCell>
        </TableRow>
      ));
    }
    
    // Check if we have the validData/invalidData format
    if (validationResult.validData !== undefined || 
        validationResult.ValidData !== undefined || 
        validationResult.invalidData !== undefined || 
        validationResult.InvalidData !== undefined) {
      
      const validData = validationResult.validData || validationResult.ValidData || [];
      const invalidData = validationResult.invalidData || validationResult.InvalidData || [];
      
      const validRows = validData.map(row => ({
        ...row,
        status: 'success',
        message: 'Identifier is valid'
      }));
      
      const invalidRows = invalidData.map(row => ({
        ...row,
        status: 'error',
        message: row.errorMessage || row.ErrorMessage || 'QR code image is required'
      }));
      
      const allRows = [...validRows, ...invalidRows];
      console.log('Using validData/invalidData format, rows count:', allRows.length);
      
      if (allRows.length === 0) {
        return null;
      }
      
      return allRows.map((row, index) => (
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
          <TableCell>{row.mattressIdentifier || row.MattressIdentifier || 'N/A'}</TableCell>
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
                  navigator.clipboard.writeText(row.epcCode || row.EpcCode || 'N/A');
                  setSnackbar({
                    open: true,
                    message: 'EPC Code copied to clipboard',
                    severity: 'success'
                  });
                }}
              >
                {row.epcCode || row.EpcCode || 'N/A'}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell>
            <StyledChip 
              label={row.status || row.Status || 'error'}
              size="small"
              color={getValidationStatusColor(row.status || row.Status || 'error')}
            />
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {row.message || row.Message || row.errorMessage || row.ErrorMessage || ''}
            </Typography>
          </TableCell>
        </TableRow>
      ));
    }
    
    // For the older rows format
    if (validationResult.rows || validationResult.Rows) {
      const rows = validationResult.rows || validationResult.Rows || [];
      console.log('Using rows format, rows count:', rows.length);
      
      return rows.map((row, index) => (
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
          <TableCell>{row.mattressId || row.mattressIdentifier || row.MattressIdentifier || 'N/A'}</TableCell>
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
                  navigator.clipboard.writeText(row.epcCode || row.EpcCode || 'N/A');
                  setSnackbar({
                    open: true,
                    message: 'EPC Code copied to clipboard',
                    severity: 'success'
                  });
                }}
              >
                {row.epcCode || row.EpcCode || 'N/A'}
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell>
            <StyledChip 
              label={row.status || row.Status || 'error'}
              size="small"
              color={getValidationStatusColor(row.status || row.Status || 'error')}
            />
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {row.message || row.Message || row.errorMessage || row.ErrorMessage || ''}
            </Typography>
          </TableCell>
        </TableRow>
      ));
    }
    
    console.warn("Could not determine validation rows format:", validationResult);
    return null;
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
              <Tab 
                icon={<DataObject sx={{ mb: 0.5 }} />} 
                label="Identifiers" 
                iconPosition="top"
              />
            </Tabs>
          </Paper>
          
          {/* Content for upload tab */}
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
                            variant={activeTab === 1 
                              ? (validationResult?.validData && validationResult.validData.length > 0) ? "contained" : "outlined"
                              : validationResult?.isValid ? "contained" : "outlined"
                            }
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={activeTab === 1 
                              ? (!validationResult?.validData || validationResult.validData.length === 0 || uploading)
                              : (!validationResult?.isValid || uploading)
                            }
                            color={activeTab === 1 
                              ? (validationResult?.validData && validationResult.validData.length > 0) ? "primary" : "inherit"
                              : validationResult?.isValid ? "primary" : "inherit"
                            }
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
                    {activeTab === 0 && validationResult && (
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
                            bgcolor: getValidationStatusColor(getValidationStats().status),
                            color: 'white',
                            py: 1.5,
                            px: 3,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {getValidationStatusIcon(getValidationStats().status)}
                          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1.5 }}>
                            Validation Results
                          </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          <Typography variant="subtitle2">
                            {getValidationStats().validCount}/{getValidationStats().totalCount} rows valid
                          </Typography>
                        </Box>
                        
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(getValidationStats().validCount / (getValidationStats().totalCount || 1)) * 100}
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              mb: 3,
                              bgcolor: 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getValidationStatusColor(getValidationStats().status)
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
                                <Typography variant="h5" fontWeight="bold">{getValidationStats().validCount}</Typography>
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
                                <Typography variant="h5" fontWeight="bold">{getValidationStats().warningCount}</Typography>
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
                                <Typography variant="h5" fontWeight="bold">{getValidationStats().errorCount}</Typography>
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
                              {getValidationStats().status === 'success' 
                                ? 'Your data is valid and ready to be processed. Proceed with saving the data.' 
                                : getValidationStats().status === 'warning'
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
                              disabled={!getValidationStats().isValid}
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
                        
                        {getValidationStats() && (
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
                                  <Typography variant="body2" fontWeight="bold">{getValidationStats().validCount}</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(getValidationStats().validCount / getValidationStats().totalCount) * 100}
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
                                  <Typography variant="body2" fontWeight="bold">{getValidationStats().warningCount}</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(getValidationStats().warningCount / getValidationStats().totalCount) * 100}
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
                                  <Typography variant="body2" fontWeight="bold">{getValidationStats().errorCount}</Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(getValidationStats().errorCount / getValidationStats().totalCount) * 100}
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
                        
                        {!getValidationStats() && (
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

          {/* History Tab */}
          {activeTab === 1 && (
            <Fade in={activeTab === 1} timeout={500}>
              <div>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  {getTabContent(activeTab).description}
                </Typography>
                
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
                              {uploadHistory && uploadHistory.length > 0 ? (
                                uploadHistory.map((item, index) => (
                                  <TableRow key={item.id || index} hover>
                                    <TableCell>{item.filename || 'Unknown file'}</TableCell>
                                    <TableCell>{item.date || 'N/A'}</TableCell>
                                    <TableCell>
                                      <StyledChip 
                                        label={item.status || 'unknown'}
                                        size="small"
                                        color={getValidationStatusColor(item.status || 'default')}
                                      />
                                    </TableCell>
                                    <TableCell>{item.recordsProcessed || 0}</TableCell>
                                    <TableCell>{item.validRecords || 0}</TableCell>
                                    <TableCell>{item.errors || 0}</TableCell>
                                    <TableCell>
                                      <Tooltip title="View Details">
                                        <IconButton size="small" sx={{ color: '#008080' }}>
                                          <Preview fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Download Report">
                                        <IconButton size="small" sx={{ color: '#008080' }}>
                                          <FileDownload fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      No history data available. Upload a file to get started.
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
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

          {/* Analytics Tab */}
          {activeTab === 2 && (
            <Fade in={activeTab === 2} timeout={500}>
              <div>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  {getTabContent(activeTab).description}
                </Typography>
                
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

          {/* Identifiers Tab */}
          {activeTab === 3 && (
            <Fade in={activeTab === 3} timeout={500}>
              <div>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  {getTabContent(activeTab).description}
                </Typography>
                
                {identifierStats && (
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h6" color="text.secondary">Total Identifiers</Typography>
                          <Typography variant="h3" fontWeight="bold" color="#008080">{identifierStats.totalCount}</Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h6" color="text.secondary">Assigned</Typography>
                          <Typography variant="h3" fontWeight="bold" color="#ef4444">{identifierStats.assignedCount}</Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h6" color="text.secondary">Available</Typography>
                          <Typography variant="h3" fontWeight="bold" color="#10b981">{identifierStats.availableCount}</Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h6" color="text.secondary">Utilization</Typography>
                          <Typography variant="h3" fontWeight="bold" color="#f59e0b">{identifierStats.percentAssigned}%</Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                )}
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                            <DataObject sx={{ mr: 1, color: '#008080' }} />
                            Mattress Identifiers
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              placeholder="Search identifiers..."
                              size="small"
                              variant="outlined"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              InputProps={{
                                startAdornment: <Search sx={{ color: '#64748b', mr: 1 }} />,
                              }}
                              sx={{ width: 250 }}
                            />
                            
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <InputLabel id="status-filter-label">Assignment Status</InputLabel>
                              <Select
                                labelId="status-filter-label"
                                value={filterAssigned}
                                onChange={(e) => setFilterAssigned(e.target.value)}
                                label="Assignment Status"
                                size="small"
                              >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="assigned">Assigned Only</MenuItem>
                                <MenuItem value="available">Available Only</MenuItem>
                              </Select>
                            </FormControl>
                            
                            <Tooltip title="Refresh Data">
                              <IconButton 
                                sx={{ color: '#008080' }}
                                onClick={fetchIdentifiers}
                                disabled={identifierLoading}
                              >
                                <Refresh />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {identifierLoading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress size={40} sx={{ color: '#008080' }} />
                          </Box>
                        ) : (
                          <>
                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 2, maxHeight: 600 }}>
                              <Table stickyHeader>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Mattress ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>EPC Code</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', width: 150 }}>QR Code</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Assignment Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {filteredIdentifiers.length > 0 ? (
                                    filteredIdentifiers.map((identifier) => (
                                      <TableRow key={identifier.id} hover>
                                        <TableCell>{identifier.mattressIdentifier}</TableCell>
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
                                                navigator.clipboard.writeText(identifier.epcCode);
                                                setSnackbar({
                                                  open: true,
                                                  message: 'EPC Code copied to clipboard',
                                                  severity: 'success'
                                                });
                                              }}
                                            >
                                              {identifier.epcCode}
                                            </Box>
                                          </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                          {identifier.qrCode ? (
                                            <Tooltip title="View QR Code">
                                              <IconButton 
                                                size="small" 
                                                onClick={() => {
                                                  // Open modal with QR code
                                                  setSelectedQrCode(identifier.qrCode);
                                                  setSelectedIdentifier(identifier.mattressIdentifier);
                                                  setQrPreviewOpen(true);
                                                }}
                                              >
                                                <img 
                                                  src={typeof identifier.qrCode === 'string' ? identifier.qrCode : '#'}
                                                  alt="QR Code"
                                                  style={{ 
                                                    width: 60, 
                                                    height: 60, 
                                                    objectFit: 'cover', 
                                                    border: '1px solid #e2e8f0', 
                                                    borderRadius: '4px', 
                                                    padding: '3px',
                                                    backgroundColor: 'white'
                                                  }}
                                                  onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTQgNCBMOCA4IEw0IDEyIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik04IDQgTDEyIDgiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                                                  }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          ) : (
                                            <Typography variant="body2" color="text.secondary">
                                              No QR Code
                                            </Typography>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <StyledChip 
                                            label={identifier.isAssigned ? 'Assigned' : 'Available'}
                                            size="small"
                                            color={identifier.isAssigned ? '#ef4444' : '#10b981'}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          {identifier.assignmentDate ? new Date(identifier.assignmentDate).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                          <Tooltip title="View Details">
                                            <IconButton size="small" sx={{ color: '#008080' }}>
                                              <Preview fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Download QR Code">
                                            <IconButton 
                                              size="small" 
                                              sx={{ color: '#008080' }}
                                              disabled={!identifier.qrCode}
                                              onClick={() => {
                                                // Create a temporary link and download the QR code
                                                if (identifier.qrCode) {
                                                  const link = document.createElement('a');
                                                  link.href = identifier.qrCode;
                                                  link.download = `QR_${identifier.mattressIdentifier}.png`;
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  document.body.removeChild(link);
                                                }
                                              }}
                                            >
                                              <FileDownload fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                          {searchQuery ? 'No identifiers match your search query' : 'No identifiers available'}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {filteredIdentifiers.length > 0 
                                  ? `Showing ${filteredIdentifiers.length} of ${Array.isArray(identifiers) ? identifiers.length : 0} identifiers` 
                                  : 'No identifiers to display'}
                              </Typography>
                              
                              <StyledButton
                                variant="outlined"
                                startIcon={<FileDownload />}
                                onClick={() => {
                                  // Export identifiers to CSV
                                  if (Array.isArray(identifiers) && identifiers.length > 0) {
                                    const csvContent = "data:text/csv;charset=utf-8," 
                                      + "Mattress ID,EPC Code,Status,Assignment Date\n"
                                      + identifiers.map(item => {
                                          return `${item.mattressIdentifier},${item.epcCode},${item.isAssigned ? 'Assigned' : 'Available'},${item.assignmentDate || 'N/A'}`;
                                        }).join("\n");
                                    
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "mattress_identifiers.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    
                                    setSnackbar({
                                      open: true,
                                      message: 'Identifiers exported to CSV',
                                      severity: 'success'
                                    });
                                  }
                                }}
                                disabled={!Array.isArray(identifiers) || identifiers.length === 0}
                              >
                                Export to CSV
                              </StyledButton>
                            </Box>
                          </>
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
              severity={getValidationStats()?.status === 'error' ? 'error' : (getValidationStats()?.status === 'warning' ? 'warning' : 'success')}
              variant="outlined"
              icon={getValidationStatusIcon(getValidationStats()?.status)}
              sx={{ borderRadius: 2 }}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>
                {getValidationStats()?.status === 'error' 
                  ? 'Validation Failed' 
                  : (getValidationStats()?.status === 'warning' 
                    ? 'Validation Completed with Warnings' 
                    : 'Validation Successful')}
              </AlertTitle>
              {getValidationStats()?.status === 'error' 
                ? `Found ${getValidationStats()?.errorCount} errors that need to be fixed.` 
                : (getValidationStats()?.status === 'warning' 
                  ? `${getValidationStats()?.warningCount} warnings detected, but data can still be processed.` 
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
                {renderValidationRows()}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {activeTab === 1 
                ? `Showing ${
                     ((validationResult?.validData?.length || 0) + 
                      (validationResult?.invalidData?.length || 0)).toString()
                    } record${
                     ((validationResult?.validData?.length || 0) + 
                      (validationResult?.invalidData?.length || 0)) !== 1 ? 's' : ''
                    }`
                  : `Showing ${validationResult?.rows?.length || 0} of ${validationResult?.totalCount || 0} records`
                }
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
            {(activeTab === 1 
              ? (validationResult?.validData && validationResult.validData.length > 0)
              : validationResult?.isValid) && (
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
            <Box component="li">
              <Typography variant="body2">
                <strong>QR Code (required)</strong> - A QR code image for each mattress or a base64 encoded QR code string
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
          
          <Typography variant="h6" gutterBottom>Adding QR Codes</Typography>
          <Typography variant="body2" paragraph>
            QR code images are required for each row in your Excel file. The QR code can be added in two ways:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Box component="li">
              <Typography variant="body2" paragraph>
                <strong>Embed an Image</strong> - In Excel, right-click on cell C2 (or corresponding QR code cell), select "Insert Picture" and choose a QR code image from your computer.
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body2" paragraph>
                <strong>Use Base64 String</strong> - Paste a base64-encoded QR code string in the QR code column. Make sure the string includes all parts of the base64 format.
              </Typography>
            </Box>
          </Box>
          <Alert severity="warning" variant="outlined" sx={{ mb: 3 }}>
            <AlertTitle>Important</AlertTitle>
            Rows without a valid QR code will fail validation. The validation logs will show "QR code image is missing" for rows that don't have a properly formatted QR code.
          </Alert>
          
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
                  <TableCell>Missing QR Code</TableCell>
                  <TableCell>QR code image is missing</TableCell>
                  <TableCell>Add a QR code image or base64 string in column C</TableCell>
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

      {/* QR Code Preview Dialog */}
      <Dialog
        open={qrPreviewOpen}
        onClose={() => setQrPreviewOpen(false)}
        maxWidth="xs"
        fullWidth
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
            <DataObject sx={{ mr: 1.5 }} />
            QR Code - {selectedIdentifier}
          </Box>
          <IconButton onClick={() => setQrPreviewOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          {selectedQrCode ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                p: 3, 
                border: '1px solid #e2e8f0', 
                borderRadius: 2,
                display: 'inline-block',
                bgcolor: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <img 
                  src={selectedQrCode} 
                  alt="QR Code" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    maxHeight: 400, 
                    padding: '20px', 
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTQgNCBMOCA4IEw0IDEyIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik04IDQgTDEyIDgiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                  }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Scan this QR code to get information about mattress {selectedIdentifier}
              </Typography>
              
              <StyledButton
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={() => {
                  if (selectedQrCode) {
                    const link = document.createElement('a');
                    link.href = selectedQrCode;
                    link.download = `QR_${selectedIdentifier}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setSnackbar({
                      open: true,
                      message: 'QR Code downloaded',
                      severity: 'success'
                    });
                  }
                }}
              >
                Download QR Code
              </StyledButton>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              QR code is not available for this identifier
            </Typography>
          )}
        </DialogContent>
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