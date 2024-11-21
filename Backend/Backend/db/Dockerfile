# Use the official SQL Server image
FROM mcr.microsoft.com/mssql/server:latest AS sqlserver

# Set environment variables
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=myPassword1!

# Expose SQL Server port
EXPOSE 1433


# if using mac or linux use the following command to enabling emulation
#Run the following code at the project cmd(to be safe but anywhere works):

#`softwareupdate --install-rosetta`

#See reference: https://devblogs.microsoft.com/azure-sql/development-with-sql-in-containers-on-macos/
