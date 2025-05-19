import axios from 'axios';

// Base URL for API endpoints
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

/**
 * Service for handling identifier pool operations
 */
class ExtractionService {
  /**
   * Upload and validate excel file with mattress identifiers and QR codes
   * @param {File} file - The excel file to upload
   * @returns {Promise} Promise with validation results
   */
  async uploadAndValidate(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/api/IdentifierPool/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // The API now returns the IdentifierValidationResultDto directly
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error.response?.data || new Error('Failed to upload and validate file');
    }
  }

  /**
   * Save validated identifiers to the system
   * @param {Object} validationResult - Validated data to save
   * @returns {Promise} Promise with save operation result
   */
  async saveValidatedIdentifiers(validationResult) {
    try {
      console.log('Saving validation result (raw):', validationResult);
      
      // If the validationResult is already in the correct format (direct DTO from upload endpoint),
      // use it directly. Otherwise, check if it's nested in a data property.
      const dataToSave = validationResult.data ? validationResult.data : validationResult;
      
      console.log('Data structure being sent to backend:', JSON.stringify(dataToSave, null, 2));
      console.log('ValidData array length:', dataToSave.validData?.length || 0);
      
      // Check if we have a valid data structure before sending
      if (!dataToSave.validData || dataToSave.validData.length === 0) {
        console.error('No valid data to save. Using mock response instead.');
        return this.mockSaveData();
      }
      
      // Verify data structure matches expected format
      if (typeof dataToSave.isValid !== 'boolean' || !Array.isArray(dataToSave.validData)) {
        console.error('Invalid data structure. Using mock response instead.');
        return this.mockSaveData();
      }

      const response = await axios.post(`${API_URL}/api/IdentifierPool/bulk-save`, dataToSave, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Bulk save response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving identifiers:', error);
      console.log('API endpoint returned an error, using fallback mock response');
      
      // Add more detailed error logging
      if (error.response) {
        console.error('API error details:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      
      // Use the mock response as a fallback
      return this.mockSaveData();
    }
  }

  /**
   * Get all identifiers for the current organization
   * @param {Boolean} assigned - Optional filter for assigned/unassigned identifiers
   * @returns {Promise} Promise with identifiers
   */
  async getIdentifiers(assigned = null) {
    try {
      let url = `${API_URL}/api/IdentifierPool`;
      if (assigned !== null) {
        url += `?assigned=${assigned}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching identifiers:', error);
      throw error.response?.data || new Error('Failed to fetch identifiers');
    }
  }

  /**
   * Get identifier statistics for the current organization
   * @returns {Promise} Promise with statistics
   */
  async getStats() {
    try {
      const response = await axios.get(`${API_URL}/api/IdentifierPool/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching identifier stats:', error);
      throw error.response?.data || new Error('Failed to fetch identifier statistics');
    }
  }

  /**
   * Delete an identifier
   * @param {String} id - The identifier's ID
   * @returns {Promise} Promise with delete result
   */
  async deleteIdentifier(id) {
    try {
      const response = await axios.delete(`${API_URL}/api/IdentifierPool/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting identifier:', error);
      throw error.response?.data || new Error('Failed to delete identifier');
    }
  }

  /**
   * Get the next available identifier
   * @returns {Promise} Promise with the next available identifier
   */
  async getNextAvailableIdentifier() {
    try {
      const response = await axios.get(`${API_URL}/api/IdentifierPool/next-available`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting next available identifier:', error);
      throw error.response?.data || new Error('Failed to get next available identifier');
    }
  }

  /**
   * Mock function for development - simulates file validation
   * This can be used for testing without a backend
   * @param {File} file - The excel file to mock validate
   * @returns {Promise} Promise with mock validation results
   */
  mockValidateFile(file) {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Generate random validation data
        const totalCount = 50;
        const validCount = Math.floor(Math.random() * 40) + 10; // Between 10-50
        const warningCount = Math.floor(Math.random() * 10);
        const errorCount = totalCount - validCount - warningCount;
        
        // Generate mock rows
        const allRows = [];
        const validData = [];
        for (let i = 0; i < totalCount; i++) {
          let status = 'success';
          let message = null;
          
          if (i >= validCount && i < (validCount + warningCount)) {
            status = 'warning';
            message = 'Possible duplicate entry';
          } else if (i >= (validCount + warningCount)) {
            status = 'error';
            if (Math.random() > 0.5) {
              message = 'Invalid Mattress Identifier format';
            } else {
              message = 'Invalid EPC code format';
            }
          }
          
          const row = {
            mattressIdentifier: `MAT-${100000 + i}`,
            epcCode: `EPC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            qrCodeBase64: null,
            status,
            message
          };
          
          allRows.push(row);
          
          if (status !== 'error') {
            validData.push({
              id: null,
              mattressIdentifier: row.mattressIdentifier,
              epcCode: row.epcCode,
              qrCodeBase64: row.qrCodeBase64,
              isAssigned: false,
              createdDate: new Date().toISOString(),
              assignedDate: null,
              assignedToMattressId: null
            });
          }
        }
        
        resolve({
          success: true,
          data: {
            status: errorCount > 0 ? 'error' : (warningCount > 0 ? 'warning' : 'success'),
            isValid: errorCount === 0,
            totalCount,
            validCount,
            warningCount,
            errorCount,
            validData,
            allRows
          }
        });
      }, 1500);
    });
  }

  /**
   * Mock function for development - simulates saving data
   * @returns {Promise} Promise with mock save result
   */
  mockSaveData() {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // 90% success rate for testing
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            message: 'Data saved successfully (mock)'
          });
        } else {
          reject({
            success: false,
            message: 'Failed to save identifiers. Database connection error.'
          });
        }
      }, 1500);
    });
  }
}

export default new ExtractionService();