import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  FormControlLabel,
  Switch,
  IconButton,
  InputAdornment,
  Alert,
  Tooltip,
  FormHelperText,
  Stack
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Upload,
  Help,
  Add,
  Delete,
  CheckCircle
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';
import CustomSidebar from '../../components/layout/Sidebar';
import { useNavigate } from 'react-router-dom';

// Steps for the form
const steps = [
  'Basic Information',
  'Material Composition',
  'Sustainability & Lifecycle',
  'Certifications & Documents',
  'Review & Submit'
];

const CreateDPPForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    productType: '',
    width: '',
    length: '',
    height: '',
    washable: 'cover_only',
    rotationInterval: '',
    
    // Material Composition
    materials: [{ name: '', percentage: '', origin: '', recycledContent: '' }],
    
    // Sustainability & Lifecycle
    expectedLifespan: '',
    warrantyPeriod: '',
    recyclingDetails: '',
    carbonFootprint: '',
    waterUsage: '',
    energyConsumption: '',
    
    // Certifications & Documents
    certifications: [{ name: '', issuer: '', validUntil: '', file: null }],
    documents: [{ name: '', type: '', file: null }],
    
    // Additional fields
    isCEAPCompliant: true,
    initialStock: '',
    manufacturerDetails: '',
    productionFacility: '',
    hazardousSubstances: 'none'
  });
  
  const navigate = useNavigate();
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle nested field changes (for arrays)
  const handleNestedChange = (index, field, subfield, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][subfield] = value;
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };
  
  // Add new item to an array field
  const handleAddItem = (field) => {
    let newItem;
    
    if (field === 'materials') {
      newItem = { name: '', percentage: '', origin: '', recycledContent: '' };
    } else if (field === 'certifications') {
      newItem = { name: '', issuer: '', validUntil: '', file: null };
    } else if (field === 'documents') {
      newItem = { name: '', type: '', file: null };
    }
    
    setFormData({
      ...formData,
      [field]: [...formData[field], newItem]
    });
  };
  
  // Remove item from an array field
  const handleRemoveItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };
  
  // Handle file uploads
  const handleFileUpload = (field, index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const updatedArray = [...formData[field]];
    updatedArray[index].file = file;
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };
  
  // Navigation between steps
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    // Show success message and redirect
    alert('Digital Product Passport created successfully!');
    navigate('/mattress-types');
  };
  
  // Cancel form and go back
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/mattress-types');
    }
  };
  
  // Render different form sections based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Basic Product Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Enter the fundamental details about your mattress type.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Memory Foam Mattress"
                  helperText="Enter a descriptive name for this mattress type"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    label="Product Type"
                  >
                    <MenuItem value="memory_foam">Memory Foam</MenuItem>
                    <MenuItem value="innerspring">Innerspring</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                    <MenuItem value="latex">Latex</MenuItem>
                    <MenuItem value="airbed">Airbed</MenuItem>
                    <MenuItem value="waterbed">Waterbed</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  <FormHelperText>Select the primary mattress technology</FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Dimensions
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Width"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Length"
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Washable</InputLabel>
                  <Select
                    name="washable"
                    value={formData.washable}
                    onChange={handleChange}
                    label="Washable"
                  >
                    <MenuItem value="cover_only">Cover Only</MenuItem>
                    <MenuItem value="full_mattress">Full Mattress</MenuItem>
                    <MenuItem value="not_washable">Not Washable</MenuItem>
                  </Select>
                  <FormHelperText>Specify which parts can be washed</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Rotation Interval"
                  name="rotationInterval"
                  type="number"
                  value={formData.rotationInterval}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                  }}
                  helperText="Recommended days between rotations"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Initial Stock"
                  name="initialStock"
                  type="number"
                  value={formData.initialStock}
                  onChange={handleChange}
                  helperText="Number of units available"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Manufacturing Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manufacturer Details"
                  name="manufacturerDetails"
                  value={formData.manufacturerDetails}
                  onChange={handleChange}
                  placeholder="e.g. Company Name, Location"
                  helperText="Enter details about the manufacturer"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Production Facility"
                  name="productionFacility"
                  value={formData.productionFacility}
                  onChange={handleChange}
                  placeholder="e.g. Factory Location"
                  helperText="Where the mattress is produced"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Material Composition
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Specify all materials used in the mattress, their percentages, origins, and recycled content.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isCEAPCompliant}
                    onChange={(e) => setFormData({...formData, isCEAPCompliant: e.target.checked})}
                    color="primary"
                  />
                }
                label="CEAP Compliant"
              />
              <Tooltip title="Enable for EU Circular Economy Action Plan compliance">
                <IconButton size="small">
                  <Help fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            {formData.isCEAPCompliant && (
              <Alert severity="info" sx={{ mb: 3 }}>
                CEAP compliance requires detailed material traceability, including origin and recycled content percentages.
              </Alert>
            )}
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Hazardous Substances</InputLabel>
              <Select
                name="hazardousSubstances"
                value={formData.hazardousSubstances}
                onChange={handleChange}
                label="Hazardous Substances"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="flame_retardants">Flame Retardants</MenuItem>
                <MenuItem value="adhesives">Adhesives</MenuItem>
                <MenuItem value="other">Other (Specify in Documents)</MenuItem>
              </Select>
              <FormHelperText>
                Declare any substances of concern as per REACH regulation
              </FormHelperText>
            </FormControl>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Material Breakdown
            </Typography>
            
            {formData.materials.map((material, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Material {index + 1}</Typography>
                      {index > 0 && (
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemoveItem('materials', index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Material Name"
                      value={material.name}
                      onChange={(e) => handleNestedChange(index, 'materials', 'name', e.target.value)}
                      placeholder="e.g. Memory Foam, Cotton, Steel Springs"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Percentage"
                      type="number"
                      value={material.percentage}
                      onChange={(e) => handleNestedChange(index, 'materials', 'percentage', e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  {formData.isCEAPCompliant && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Origin"
                          value={material.origin}
                          onChange={(e) => handleNestedChange(index, 'materials', 'origin', e.target.value)}
                          placeholder="e.g. Country or Supplier"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Recycled Content"
                          type="number"
                          value={material.recycledContent}
                          onChange={(e) => handleNestedChange(index, 'materials', 'recycledContent', e.target.value)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleAddItem('materials')}
              sx={{ 
                mt: 1,
                borderColor: '#008080',
                color: '#008080',
                '&:hover': {
                  borderColor: '#006666',
                  bgcolor: 'rgba(0,128,128,0.04)'
                }
              }}
            >
              Add Material
            </Button>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Sustainability & Lifecycle Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Provide details about the mattress's lifecycle, environmental impact, and end-of-life considerations.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Expected Lifespan"
                  name="expectedLifespan"
                  value={formData.expectedLifespan}
                  onChange={handleChange}
                  placeholder="e.g. 10 years"
                  helperText="How long the mattress is designed to last"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Warranty Period"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                  placeholder="e.g. 5 years"
                  helperText="Length of manufacturer warranty"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Recycling Details"
                  name="recyclingDetails"
                  value={formData.recyclingDetails}
                  onChange={handleChange}
                  placeholder="Describe how the mattress can be recycled or disposed of at end-of-life"
                  helperText="Provide specific instructions for recycling each component"
                  sx={{ mb: 3 }}
                />
              </Grid>
              
              {formData.isCEAPCompliant && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Environmental Impact Metrics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      These metrics are required for CEAP compliance to demonstrate environmental transparency.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Carbon Footprint"
                      name="carbonFootprint"
                      value={formData.carbonFootprint}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg CO₂e</InputAdornment>,
                      }}
                      helperText="CO₂ equivalent emissions per unit"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Water Usage"
                      name="waterUsage"
                      value={formData.waterUsage}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">liters</InputAdornment>,
                      }}
                      helperText="Water used in production"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Energy Consumption"
                      name="energyConsumption"
                      value={formData.energyConsumption}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                      }}
                      helperText="Energy used in manufacturing"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        );
        
      case 3:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Certifications & Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload relevant certifications and supporting documentation for the mattress type.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Certifications
            </Typography>
            
            {formData.certifications.map((cert, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Certification {index + 1}</Typography>
                      {index > 0 && (
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemoveItem('certifications', index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Certification Name"
                      value={cert.name}
                      onChange={(e) => handleNestedChange(index, 'certifications', 'name', e.target.value)}
                      placeholder="e.g. OEKO-TEX, CertiPUR-US"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => handleNestedChange(index, 'certifications', 'issuer', e.target.value)}
                      placeholder="e.g. OEKO-TEX Association"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valid Until"
                      type="date"
                      value={cert.validUntil}
                      onChange={(e) => handleNestedChange(index, 'certifications', 'validUntil', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<Upload />}
                      sx={{ 
                        height: '56px',
                        width: '100%',
                        borderColor: cert.file ? '#008080' : '#cbd5e1',
                        color: cert.file ? '#008080' : '#64748b',
                        '&:hover': {
                          borderColor: '#008080',
                          bgcolor: 'rgba(0,128,128,0.04)'
                        }
                      }}
                    >
                      {cert.file ? cert.file.name : 'Upload Certificate'}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.png,.jpeg"
                        onChange={(e) => handleFileUpload('certifications', index, e)}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleAddItem('certifications')}
              sx={{ 
                mt: 1,
                mb: 4,
                borderColor: '#008080',
                color: '#008080',
                '&:hover': {
                  borderColor: '#006666',
                  bgcolor: 'rgba(0,128,128,0.04)'
                }
              }}
            >
              Add Certification
            </Button>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Additional Documents
            </Typography>
            
            {formData.documents.map((doc, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Document {index + 1}</Typography>
                      {index > 0 && (
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemoveItem('documents', index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Document Name"
                      value={doc.name}
                      onChange={(e) => handleNestedChange(index, 'documents', 'name', e.target.value)}
                      placeholder="e.g. Care Instructions, Safety Data Sheet"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Document Type</InputLabel>
                      <Select
                        value={doc.type}
                        onChange={(e) => handleNestedChange(index, 'documents', 'type', e.target.value)}
                        label="Document Type"
                      >
                        <MenuItem value="safety_data">Safety Data Sheet</MenuItem>
                        <MenuItem value="care_instructions">Care Instructions</MenuItem>
                        <MenuItem value="warranty">Warranty Information</MenuItem>
                        <MenuItem value="environmental">Environmental Impact</MenuItem>
                        <MenuItem value="test_results">Test Results</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<Upload />}
                      sx={{ 
                        height: '56px',
                        width: '100%',
                        borderColor: doc.file ? '#008080' : '#cbd5e1',
                        color: doc.file ? '#008080' : '#64748b',
                        '&:hover': {
                          borderColor: '#008080',
                          bgcolor: 'rgba(0,128,128,0.04)'
                        }
                      }}
                    >
                      {doc.file ? doc.file.name : 'Upload Document'}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                        onChange={(e) => handleFileUpload('documents', index, e)}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleAddItem('documents')}
              sx={{ 
                mt: 1,
                borderColor: '#008080',
                color: '#008080',
                '&:hover': {
                  borderColor: '#006666',
                  bgcolor: 'rgba(0,128,128,0.04)'
                }
              }}
            >
              Add Document
            </Button>
          </Box>
        );
        
      case 4:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
              Review & Submit
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review all information before submitting the Digital Product Passport.
            </Typography>
            
            <Alert 
              severity="info" 
              sx={{ mb: 3 }}
              icon={<CheckCircle fontSize="inherit" />}
            >
              {formData.isCEAPCompliant ? 
                'This DPP is configured for CEAP compliance with all required fields.' : 
                'This DPP is not configured for CEAP compliance. Some regulatory requirements may not be met.'}
            </Alert>
            
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Product Name</Typography>
                  <Typography variant="body1">{formData.name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Product Type</Typography>
                  <Typography variant="body1">
                    {formData.productType ? 
                      formData.productType.replace('_', ' ').charAt(0).toUpperCase() + 
                      formData.productType.replace('_', ' ').slice(1) : 
                      'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Width</Typography>
                  <Typography variant="body1">{formData.width ? `${formData.width} cm` : 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Length</Typography>
                  <Typography variant="body1">{formData.length ? `${formData.length} cm` : 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Height</Typography>
                  <Typography variant="body1">{formData.height ? `${formData.height} cm` : 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Materials & Sustainability
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Materials</Typography>
                  <Box sx={{ mt: 1 }}>
                    {formData.materials.map((material, index) => (
                      material.name && (
                        <Chip 
                          key={index}
                          label={`${material.name} (${material.percentage}%)`}
                          size="small"
                          sx={{ 
                            mr: 1, 
                            mb: 1,
                            bgcolor: 'rgba(0,128,128,0.1)',
                            color: '#008080'
                          }}
                        />
                      )
                    ))}
                    {!formData.materials.some(m => m.name) && <Typography variant="body1">No materials specified</Typography>}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Expected Lifespan</Typography>
                  <Typography variant="body1">{formData.expectedLifespan || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Warranty Period</Typography>
                  <Typography variant="body1">{formData.warrantyPeriod || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Documents & Certifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Certifications</Typography>
                  <Box sx={{ mt: 1 }}>
                    {formData.certifications.map((cert, index) => (
                      cert.name && (
                        <Chip 
                          key={index}
                          label={cert.name}
                          size="small"
                          icon={<CheckCircle fontSize="small" />}
                          sx={{ 
                            mr: 1, 
                            mb: 1,
                            bgcolor: 'rgba(0,128,128,0.1)',
                            color: '#008080'
                          }}
                        />
                      )
                    ))}
                    {!formData.certifications.some(c => c.name) && <Typography variant="body1">No certifications specified</Typography>}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Documents</Typography>
                  <Box sx={{ mt: 1 }}>
                    {formData.documents.map((doc, index) => (
                      doc.name && (
                        <Chip 
                          key={index}
                          label={doc.name}
                          size="small"
                          sx={{ 
                            mr: 1, 
                            mb: 1,
                            bgcolor: 'rgba(0,128,128,0.1)',
                            color: '#008080'
                          }}
                        />
                      )
                    ))}
                    {!formData.documents.some(d => d.name) && <Typography variant="body1">No documents specified</Typography>}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
        
      default:
        return null;
    }
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
            Create Digital Product Passport
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': {
                borderColor: '#008080',
                bgcolor: 'rgba(0,128,128,0.04)'
              },
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: 4, 
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#008080', 
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#008080', 
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: '#64748b',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<Save />}
                  sx={{
                    bgcolor: '#008080',
                    '&:hover': {
                      bgcolor: '#006666',
                    },
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,128,128,0.2)',
                    px: 4
                  }}
                >
                  Submit DPP
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: '#008080',
                    '&:hover': {
                      bgcolor: '#006666',
                    },
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,128,128,0.2)'
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default CreateDPPForm;