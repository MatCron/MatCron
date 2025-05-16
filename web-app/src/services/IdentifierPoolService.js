import axios from 'axios';

// Base URL for API endpoints
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

/**
 * Service for handling identifier pool operations
 */
class IdentifierPoolService {
  /**
   * Upload and validate excel file
   * @param {File} file - The excel file to upload
   * @returns {Promise} Promise with validation results
   */
  async uploadAndValidate(file) {
    try {
      console.log('Attempting to upload file for validation:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/api/IdentifierPool/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('API upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in uploadAndValidate:', error);
      throw error.response?.data || new Error('Failed to upload and validate file');
    }
  }

  /**
   * Save validated identifiers to the system
   * @param {Object} data - Validated data to save
   * @returns {Promise} Promise with save operation result
   */
  async saveIdentifiers(data) {
    try {
      console.log('Attempting to save identifiers:', data);
      
      // Extract the correct data format for the API
      let identifiersToSave = [];
      
      // Handle different possible formats from the validation result
      if (data.validData || data.ValidData) {
        // Extract valid identifiers from validData
        const validData = data.validData || data.ValidData || [];
        identifiersToSave = validData.map(item => ({
          mattressIdentifier: item.mattressIdentifier || item.MattressIdentifier,
          epcCode: item.epcCode || item.EpcCode,
          qrCode: item.qrCode || item.QrCode,
          isAssigned: false // Add this field as it's required by the backend
        }));
      } else if (data.allRows || data.AllRows) {
        // Filter only valid rows from allRows
        const allRows = data.allRows || data.AllRows || [];
        identifiersToSave = allRows
          .filter(row => row.status === 'success' || row.Status === 'success')
          .map(row => ({
            mattressIdentifier: row.mattressIdentifier || row.MattressIdentifier,
            epcCode: row.epcCode || row.EpcCode,
            qrCode: row.qrCode || row.QrCode,
            isAssigned: false // Add this field as it's required by the backend
          }));
      } else if (data.rows || data.Rows) {
        // Handle the older rows format
        const rows = data.rows || data.Rows || [];
        identifiersToSave = rows
          .filter(row => row.status === 'success' || row.Status === 'success')
          .map(row => ({
            mattressIdentifier: row.mattressId || row.mattressIdentifier || row.MattressIdentifier,
            epcCode: row.epcCode || row.EpcCode,
            qrCode: row.qrCode || row.QrCode,
            isAssigned: false // Add this field as it's required by the backend
          }));
      }
      
      // Log what we're about to send to the API
      console.log(`Sending ${identifiersToSave.length} identifiers to API:`, identifiersToSave);
      
      if (identifiersToSave.length === 0) {
        throw new Error('No valid identifiers found to save');
      }

      // Format the data according to IdentifierValidationResultDto
      const validationResult = {
        isValid: true,
        Status: "success",
        ValidData: identifiersToSave,
        TotalCount: identifiersToSave.length,
        ValidCount: identifiersToSave.length,
        ErrorCount: 0,
        WarningCount: 0
      };
      
      const response = await axios.post(`${API_URL}/api/IdentifierPool/bulk-save`, validationResult, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('API save response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in saveIdentifiers:', error);
      
      // Handle validation errors from the backend
      if (error.response?.status === 400) {
        const validationError = error.response.data;
        throw new Error(validationError.message || 'Validation failed. Please check the data and try again.');
      }
      
      throw error.response?.data || new Error('Failed to save identifiers');
    }
  }
  
  /**
   * Get identifier pool history
   * @returns {Promise} Promise with identifier pool history
   */
  async getHistory() {
    try {
      console.log('Fetching identifier pool history');
      
      const response = await axios.get(`${API_URL}/api/IdentifierPool`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('API history response:', response.data);
      
      // Format the response to match the expected history format
      const formattedHistory = Array.isArray(response.data) ? response.data.map((item, index) => ({
        id: item.id || String(index + 1),
        filename: item.filename || 'Identifier upload',
        date: item.createdAt || new Date().toISOString().split('T')[0],
        status: item.isAssigned ? 'success' : 'warning',
        recordsProcessed: 1,
        validRecords: item.isAssigned ? 1 : 0,
        errors: item.isAssigned ? 0 : 1
      })) : [];
      
      return formattedHistory;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error.response?.data || new Error('Failed to fetch identifier pool history');
    }
  }

  /**
   * Get identifier pool statistics
   * @returns {Promise} Promise with identifier pool statistics
   */
  async getStats() {
    try {
      console.log('Fetching identifier pool statistics');
      
      const response = await axios.get(`${API_URL}/api/IdentifierPool/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('API stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error.response?.data || new Error('Failed to fetch identifier pool statistics');
    }
  }

  /**
   * Generate a sample QR code as a base64 string
   * @param {string} text - Text to encode in the QR code
   * @returns {Promise<string>} Base64 string of the QR code
   */
  async generateQRCode(text) {
    try {
      // Use the QRCode library to generate a QR code
      const QRCode = require('qrcode');
      return new Promise((resolve, reject) => {
        QRCode.toDataURL(text, { 
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 200
        }, (err, url) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(url);
        });
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Return a placeholder if QR code generation fails
      return "Add QR code here - generation failed";
    }
  }

  /**
   * Download a template for identifier pool data
   * @returns {Promise} Promise with template download result
   */
  async downloadTemplate() {
    try {
      console.log('Attempting to download identifier pool template');
      
      // Create a simple Excel file using xlsx library
      const XLSX = require('xlsx');
      const workbook = XLSX.utils.book_new();
      
      // Try to generate sample QR codes
      let qrCode1 = "Add a QR code image here";
      let qrCode2 = "Add a QR code image here";
      
      try {
        qrCode1 = await this.generateQRCode("MAT-001-QR-CODE");
        qrCode2 = await this.generateQRCode("MAT-002-QR-CODE");
      } catch (err) {
        console.warn('Could not generate sample QR codes:', err);
      }
      
      // Create sample data with instructions for QR code column
      const sampleData = [
        ["Mattress Identifier", "EPC Code", "QR Code (required)"],
        ["MAT-001", "EPC-12345ABC", qrCode1],
        ["MAT-002", "EPC-67890XYZ", qrCode2]
      ];
      
      // Convert to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
      
      // Add comments to the QR code column cells
      worksheet['C1'].c = [{ a: 'QR Code Instructions', t: 'This column requires a QR code image for each mattress' }];
      worksheet['C2'].c = [{ a: 'QR Code Format', t: 'Insert an image by right-clicking the cell and selecting "Insert Picture" from your file system' }];
      worksheet['C3'].c = [{ a: 'QR Code Example', t: 'Alternatively, you can paste a base64 encoded QR code string. Rows without a QR code will be rejected.' }];
      
      // Make column C wider to accommodate instructions
      worksheet['!cols'] = [
        { wch: 20 }, // A column - Mattress Identifier
        { wch: 20 }, // B column - EPC Code
        { wch: 40 }  // C column - QR Code instruction
      ];
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
      
      // Generate file and trigger download
      XLSX.writeFile(workbook, "identifier-pool-template.xlsx");
      
      return { success: true, message: 'Template downloaded successfully with sample QR codes' };
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error.response?.data || new Error('Failed to download template');
    }
  }

  /**
   * Mock method for backwards compatibility with old ExtractionService
   * @param {File} file - The file to validate
   * @returns {Promise} Promise with mock validation results
   */
  async mockValidateFile(file) {
    console.log('Using mockValidateFile as fallback for old ExtractionService interface');
    // Delegate to the real method
    return this.uploadAndValidate(file);
  }

  /**
   * Mock method for backwards compatibility with old ExtractionService
   * @returns {Promise} Promise with mock save results
   */
  async mockSaveData() {
    console.log('Using mockSaveData as fallback for old ExtractionService interface');
    
    // Return mock data that matches the format expected by old code
    return {
      success: true,
      message: 'Data saved successfully'
    };
  }

  /**
   * Get all identifiers from the pool with optional filtering by assignment status
   * @param {string} assignmentStatus - Filter by assignment status ('all', 'assigned', 'available')
   * @returns {Promise} Promise with identifier list
   */
  async getIdentifiers(assignmentStatus = 'all') {
    try {
      console.log(`Fetching identifiers with filter: ${assignmentStatus}`);
      
      // Build the URL with optional query parameters
      let url = `${API_URL}/api/IdentifierPool`;
      if (assignmentStatus !== 'all') {
        const isAssigned = assignmentStatus === 'assigned';
        url += `?isAssigned=${isAssigned}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log(`Retrieved ${response.data.length} identifiers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching identifiers:', error);
      throw error.response?.data || new Error('Failed to fetch identifiers');
    }
  }
}

export default new IdentifierPoolService(); 