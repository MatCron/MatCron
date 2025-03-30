import axios from 'axios';

// Base URL for API endpoints
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Service for handling data extraction operations
 */
class ExtractionService {
  /**
   * Upload and validate excel file
   * @param {File} file - The excel file to upload
   * @returns {Promise} Promise with validation results
   */
  async uploadAndValidate(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/api/excel/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error.response?.data || new Error('Failed to upload and validate file');
    }
  }

  /**
   * Save validated data to the system
   * @param {Object} data - Validated data to save
   * @returns {Promise} Promise with save operation result
   */
  async saveData(data) {
    try {
      const response = await axios.post(`${API_URL}/api/excel/save`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error.response?.data || new Error('Failed to save data');
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
        const rows = [];
        for (let i = 0; i < totalCount; i++) {
          let status = 'success';
          let message = null;
          
          if (i >= validCount && i < (validCount + warningCount)) {
            status = 'warning';
            message = 'Possible duplicate entry';
          } else if (i >= (validCount + warningCount)) {
            status = 'error';
            if (Math.random() > 0.5) {
              message = 'Invalid Mattress ID format';
            } else {
              message = 'Invalid EPC code format';
            }
          }
          
          rows.push({
            mattressId: `MAT-${100000 + i}`,
            epcCode: `EPC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            status,
            message
          });
        }
        
        resolve({
          status: errorCount > 0 ? 'error' : (warningCount > 0 ? 'warning' : 'success'),
          isValid: errorCount === 0,
          totalCount,
          validCount,
          warningCount,
          errorCount,
          data: rows.filter(row => row.status === 'success'),
          rows
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
            message: 'Data saved successfully'
          });
        } else {
          reject({
            success: false,
            message: 'Failed to save data. Database connection error.'
          });
        }
      }, 1500);
    });
  }
}

export default new ExtractionService(); 