using System;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Common.Utilities;

public class PasswordHelper
{
    private const string Salt = "n0xfDfb0rN";
    private const int Rounds = 1000;

    public static bool VerifyPassword(string receivedString, string passwordFromDB)
    {
        // Split the hash and timestamp
        var decryptedData = DecryptData(receivedString, "encryptPassword");

        var parts = decryptedData.Split('|');
        if (parts.Length != 2)
        {
            return false;
        }

        string receivedHash = parts[0];
        string timestamp = parts[1];

        // Hash the plain password using the same salt and rounds
        string computedHash = passwordFromDB;

        // Compare the computed hash with the received hash
        bool isPasswordValid = receivedHash == computedHash;

        // Optional: Parse and use the timestamp if needed
        DateTime parsedTimestamp = DateTime.Parse(timestamp);
        DateTime now = DateTime.UtcNow;
        TimeSpan timeDifference = now - parsedTimestamp;

        // Check if the difference is less than or equal to 5 minutes
        var time = timeDifference.TotalMinutes;
        bool isTimeValid = timeDifference.TotalMinutes <= 5 && timeDifference.TotalMinutes >= 0;
        

        return isPasswordValid == isTimeValid;
    }

    public static string DecryptData(string base64EncryptedData, string encryptionKey)
    {
        try
        {
            // Split the input data into IV and ciphertext (split by ':')
            var parts = base64EncryptedData.Split(':');
            string ivBase64 = parts[0]; // First part is the IV
            string encryptedBase64 = parts[1]; // Second part is the encrypted data

            // Decode the Base64 values
            byte[] iv = Convert.FromBase64String(ivBase64); // Decode IV
            byte[] encryptedBytes = Convert.FromBase64String(encryptedBase64); // Decode encrypted data

            // Ensure the key is 32 bytes (pad with spaces if necessary)
            byte[] keyBytes = Encoding.UTF8.GetBytes(encryptionKey.PadRight(32, ' '));

            using (Aes aes = Aes.Create())
            {
                aes.Key = keyBytes;
                aes.IV = iv; // Use the extracted IV
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                using (var decryptor = aes.CreateDecryptor(aes.Key, aes.IV))
                {
                    using (var ms = new MemoryStream(encryptedBytes))
                    {
                        using (var cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (var sr = new StreamReader(cryptoStream))
                            {
                                return sr.ReadToEnd(); // Return decrypted data as a string
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception("Decryption failed", ex);
        }
    }



}