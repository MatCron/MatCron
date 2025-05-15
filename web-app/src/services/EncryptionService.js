import CryptoJS from 'crypto-js';

class EncryptionService {
  static hashAndSaltPassword(password, salt = "matrcronIsTheBest2024") {
    const combined = password + salt;
    return CryptoJS.SHA256(combined).toString();
  }

  static getCurrentDatetime() {
    return new Date().toISOString();
  }

  static combinePasswordAndDatetime(passwordHash, datetime) {
    return `${passwordHash}|${datetime}`;
  }

  static encryptData(data, encryptionKey = "encryptPassword") {
    // Ensure key is 32 bytes
    const key = encryptionKey.padEnd(32, ' ');
    
    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Combine IV and ciphertext with delimiter
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const ciphertextBase64 = encrypted.toString();
    
    return `${ivBase64}:${ciphertextBase64}`;
  }

  static encryptPassword(password) {
    const hashedPassword = this.hashAndSaltPassword(password);
    const datetime = this.getCurrentDatetime();
    const combinedData = this.combinePasswordAndDatetime(hashedPassword, datetime);
    return this.encryptData(combinedData);
  }
}

export default EncryptionService; 