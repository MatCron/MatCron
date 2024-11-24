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
        var parts = receivedString.Split('-');
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
        bool isTimeValid = timeDifference.TotalMinutes <= 5 && timeDifference.TotalMinutes >= 0;
        

        return isPasswordValid == isTimeValid;
    }

}