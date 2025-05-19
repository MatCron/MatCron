using System;
using System.Security.Cryptography;
using System.Text;
namespace Backend.Testing.Auth_Test
{ 
public class EncryptionHelper
{
	// Step 1: Hash and salt the password
	public static string HashAndSaltPassword(string password, string salt)
	{
		using (SHA256 sha256 = SHA256.Create())
		{
			string combined = password + salt; // Combine password and salt
			byte[] bytes = Encoding.UTF8.GetBytes(combined);
			byte[] hash = sha256.ComputeHash(bytes);
			return BitConverter.ToString(hash).Replace("-", "").ToLower(); // Return the hashed password
		}
	}

	// Step 2: Get the current datetime
	public string GetCurrentDatetime()
	{
		return DateTime.UtcNow.ToString("o"); // Returns ISO 8601 formatted datetime string
	}

	// Step 3: Combine password hash and datetime with a delimiter
	public string CombinePasswordAndDatetime(string passwordHash, string datetime)
	{
		return $"{passwordHash}|{datetime}"; // Combine with delimiter '|'
	}

	// Step 4: Encrypt the combination of password hash and datetime
	public string EncryptData(string data, string encryptionKey)
	{
		// Ensure the encryption key is 32 bytes long
		encryptionKey = encryptionKey.PadRight(32, ' ');

		// Convert the key and IV to bytes
		byte[] keyBytes = Encoding.UTF8.GetBytes(encryptionKey);
		byte[] ivBytes = new byte[16]; // 16-byte IV for AES (CBC mode)
		using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
		{
			rng.GetBytes(ivBytes); // Generate a random IV
		}

		using (Aes aes = Aes.Create())
		{
			aes.Key = keyBytes;
			aes.IV = ivBytes;
			aes.Mode = CipherMode.CBC;
			aes.Padding = PaddingMode.PKCS7;

			using (ICryptoTransform encryptor = aes.CreateEncryptor())
			{
				byte[] dataBytes = Encoding.UTF8.GetBytes(data);
				byte[] encryptedBytes = encryptor.TransformFinalBlock(dataBytes, 0, dataBytes.Length);

				// Encode IV and ciphertext as Base64
				string ivBase64 = Convert.ToBase64String(ivBytes);
				string ciphertextBase64 = Convert.ToBase64String(encryptedBytes);

				// Combine IV and ciphertext with a delimiter
				return $"{ivBase64}:{ciphertextBase64}";
			}
		}
	}

	// Combine all steps for encryption
	public string EncryptPassword(string password)
	{
		string salt = "matrcronIsTheBest2024";
		string encryptionKey = "encryptPassword";
		string hashedPassword = HashAndSaltPassword(password, salt);
		string datetime = GetCurrentDatetime();
		string combinedData = CombinePasswordAndDatetime(hashedPassword, datetime);
		return EncryptData(combinedData, encryptionKey);
	}
}
}