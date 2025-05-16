/**
 * This service has been deprecated and its functionality has been consolidated into IdentifierPoolService.
 * Please use IdentifierPoolService for all identifier pool operations.
 */

import axios from 'axios';
import IdentifierPoolService from './IdentifierPoolService';

// Base URL for API endpoints
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

class ExtractionService {
  async uploadAndValidate(file) {
    console.log('ExtractionService.uploadAndValidate is deprecated. Using IdentifierPoolService instead.');
    return IdentifierPoolService.uploadAndValidate(file);
  }

  async saveData(data) {
    console.log('ExtractionService.saveData is deprecated. Using IdentifierPoolService instead.');
    return IdentifierPoolService.saveIdentifiers(data);
  }
  
  async getHistory() {
    console.log('ExtractionService.getHistory is deprecated. Using IdentifierPoolService instead.');
    return IdentifierPoolService.getHistory();
  }

  async generateQRCode(text) {
    console.log('ExtractionService.generateQRCode is deprecated. Using IdentifierPoolService instead.');
    return IdentifierPoolService.generateQRCode(text);
  }

  async downloadTemplate() {
    console.log('ExtractionService.downloadTemplate is deprecated. Using IdentifierPoolService instead.');
    return IdentifierPoolService.downloadTemplate();
  }

  // Add mock methods for backward compatibility
  async mockValidateFile(file) {
    console.log('Using mockValidateFile. This is a deprecated method.');
    return this.uploadAndValidate(file);
  }

  async mockSaveData() {
    console.log('Using mockSaveData. This is a deprecated method.');
    return {
      success: true,
      message: 'Data saved successfully (via deprecated service)'
    };
  }
}

export default new ExtractionService();