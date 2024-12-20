-- 
-- CREATE DATABASE MyDatabase;
-- GO
-- USE MyDatabase;
-- GO
-- 
-- 
-- SET ANSI_NULLS ON
-- GO  
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[Organisations](
--     [Id] [uniqueidentifier] NOT NULL,
--     [Name] [nvarchar](100) NULL,
--     [Email] [nvarchar](100) NULL,
--     [Description] [nvarchar](max) NULL,
--     [PostalAddress] [nvarchar](max) NULL,
--     [NormalAddress] [nvarchar](max) NULL,
--     [WebsiteLink] [nvarchar](max) NULL,
--     [Logo] [nvarchar](max) NULL,
--     [RegistrationNo] [nvarchar](100) NULL,
--     [OrganisationType] [nvarchar](50) NULL,
--     [OrganisationCode] [nvarchar](50) NOT NULL
--     ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--     GO
-- ALTER TABLE [dbo].[Organisations] ADD  CONSTRAINT [PK_Organisations] PRIMARY KEY CLUSTERED
--     (
--     [Id] ASC
--     )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
--     GO
-- ALTER TABLE [dbo].[Organisations] ADD  DEFAULT (newid()) FOR [Id]
--     GO
-- 
-- 
-- 
-- -- Below is the Users Table 
--     SET ANSI_NULLS ON
--     GO
--     SET QUOTED_IDENTIFIER ON
--     GO
-- CREATE TABLE [dbo].[Users](
--     [Id] [uniqueidentifier] NOT NULL,
--     [OrgId] [uniqueidentifier] NOT NULL,
--     [FirstName] [nvarchar](50) NOT NULL,
--     [LastName] [nvarchar](50) NOT NULL,
--     [Password] [nvarchar](max) NOT NULL,
--     [Email] [nvarchar](100) NULL,
--     [EmailVerified] [tinyint] NOT NULL,
--     [UserType] [tinyint] NULL,
--     [ProfilePicture] [nvarchar](max) NULL,
--     [Token] [text] Null
--     ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
--     GO
-- ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED
--     (
--     [Id] ASC
--     )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
--     GO
-- ALTER TABLE [dbo].[Users] ADD  DEFAULT (newid()) FOR [Id]
--     GO
-- ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [EmailVerified]
--     GO
-- ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Organisations] FOREIGN KEY([OrgId])
--     REFERENCES [dbo].[Organisations] ([Id])
--     ON DELETE CASCADE
-- GO
-- ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Organisations]
--     GO
-- 
-- 
--     
--     
-- --     Mattress Type Table 
-- 
--     SET ANSI_NULLS ON
--     GO
--     SET QUOTED_IDENTIFIER ON
--     GO
-- CREATE TABLE [dbo].[MattressType](
--     [Id] [uniqueidentifier] NOT NULL,
--     [Name] [nvarchar](100) NOT NULL,
--     [Width] [float] NOT NULL,
--     [Length] [float] NOT NULL,
--     [Height] [float] NOT NULL,
--     [Composition] [nvarchar](500) NOT NULL,
--     [Washable] [tinyint] NOT NULL,
--     [RotationInterval] [float] NOT NULL,
--     [RecyclingDetails] [nvarchar](500) NOT NULL,
--     [ExpectedLifespan] [float] NOT NULL,
--     [WarrantyPeriod] [float] NOT NULL,
--     [Stock] [float] NOT NULL
--     ) ON [PRIMARY]
--     GO
-- ALTER TABLE [dbo].[MattressType] ADD PRIMARY KEY CLUSTERED
--     (
--     [Id] ASC
--     )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
--     GO
-- ALTER TABLE [dbo].[MattressType] ADD  DEFAULT (newid()) FOR [Id]
--     GO

CREATE TABLE `Users` (
                         `Id` char(36) NOT NULL DEFAULT (uuid()),
                         `OrgId` char(36) NOT NULL,
                         `GroupId` char(36) DEFAULT NULL,
                         `FirstName` varchar(50) NOT NULL,
                         `LastName` varchar(50) NOT NULL,
                         `Password` text NOT NULL,
                         `Email` varchar(100) DEFAULT NULL,
                         `EmailVerified` tinyint(1) NOT NULL DEFAULT '0',
                         `UserType` tinyint DEFAULT NULL,
                         `ProfilePicture` text,
                         `Token` text,
                         PRIMARY KEY (`Id`),
                         KEY `OrgId` (`OrgId`),
                         KEY `GroupId` (`GroupId`),
                         CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`OrgId`) REFERENCES `Organisations` (`Id`) ON DELETE CASCADE,
                         CONSTRAINT `Users_ibfk_2` FOREIGN KEY (`GroupId`) REFERENCES `Groups` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Organisations` (
                                 `Id` char(36) NOT NULL DEFAULT (uuid()),
                                 `Name` varchar(100) DEFAULT NULL,
                                 `Email` varchar(100) DEFAULT NULL,
                                 `Description` text,
                                 `PostalAddress` text,
                                 `NormalAddress` text,
                                 `WebsiteLink` text,
                                 `Logo` text,
                                 `RegistrationNo` varchar(100) DEFAULT NULL,
                                 `OrganisationType` varchar(50) DEFAULT NULL,
                                 `OrganisationCode` varchar(50) NOT NULL,
                                 PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `Mattresses` (
                              `Uid` char(36) NOT NULL DEFAULT (uuid()),
                              `MattressTypeId` char(36) NOT NULL,
                              `OrgId` char(36) DEFAULT NULL,
                              `LocationId` char(36) DEFAULT NULL,
                              `BatchNo` varchar(50) DEFAULT NULL,
                              `ProductionDate` date NOT NULL,
                              `EpcCode` varchar(100) DEFAULT NULL,
                              `Status` tinyint NOT NULL,
                              `LifeCyclesEnd` date DEFAULT NULL,
                              `DaysToRotate` int NOT NULL,
                              PRIMARY KEY (`Uid`),
                              KEY `MattressTypeId` (`MattressTypeId`),
                              KEY `OrganisationId` (`OrganisationId`),
                              KEY `LocationId` (`LocationId`),
                              CONSTRAINT `Mattresses_ibfk_1` FOREIGN KEY (`MattressTypeId`) REFERENCES `MattressTypes` (`Id`) ON DELETE CASCADE,
                              CONSTRAINT `Mattresses_ibfk_2` FOREIGN KEY (`OrganisationId`) REFERENCES `Organisations` (`Id`) ON DELETE CASCADE,
                              CONSTRAINT `Mattresses_ibfk_3` FOREIGN KEY (`LocationId`) REFERENCES `LocationMattresses` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `MattressTypes` (
                                 `Id` char(36) NOT NULL DEFAULT (uuid()),
                                 `Name` varchar(100) NOT NULL,
                                 `Width` double NOT NULL,
                                 `Length` double NOT NULL,
                                 `Height` double NOT NULL,
                                 `Washable` tinyint(1) NOT NULL,
                                 `RotationInterval` double NOT NULL,
                                 `ExpectedLifespan` double NOT NULL,
                                 `WarrantyPeriod` double NOT NULL,
                                 `Stock` double NOT NULL,
                                 `Composition` varchar(500) NOT NULL,
                                 `RecyclingDetails` varchar(500) NOT NULL,
                                 PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `MattressGroups` (
                                  `MattressId` char(36) NOT NULL,
                                  `GroupId` char(36) NOT NULL,
                                  PRIMARY KEY (`MattressId`,`GroupId`),
                                  KEY `GroupId` (`GroupId`),
                                  CONSTRAINT `MattressGroups_ibfk_1` FOREIGN KEY (`MattressId`) REFERENCES `Mattresses` (`Uid`) ON DELETE CASCADE,
                                  CONSTRAINT `MattressGroups_ibfk_2` FOREIGN KEY (`GroupId`) REFERENCES `Groups` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `LogMattresses` (
                                 `Id` char(36) NOT NULL DEFAULT (uuid()),
                                 `MattressId` char(36) NOT NULL,
                                 `Status` varchar(50) NOT NULL,
                                 `Details` varchar(500) DEFAULT NULL,
                                 `Type` varchar(50) NOT NULL,
                                 `TimeStamp` datetime NOT NULL,
                                 PRIMARY KEY (`Id`),
                                 KEY `MattressId` (`MattressId`),
                                 CONSTRAINT `LogMattresses_ibfk_1` FOREIGN KEY (`MattressId`) REFERENCES `Mattresses` (`Uid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `LocationMattresses` (
                                      `Id` char(36) NOT NULL DEFAULT (uuid()),
                                      `Name` varchar(100) NOT NULL,
                                      `Description` varchar(500) DEFAULT NULL,
                                      `Status` tinyint(1) NOT NULL DEFAULT '1',
                                      PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci




CREATE TABLE `Groups` (
                          `Id` char(36) NOT NULL DEFAULT (uuid()),
                          `OrgId` char(36) NOT NULL,
                          `Status` tinyint DEFAULT NULL,
                          `ContactNumber` varchar(50) DEFAULT NULL,
                          PRIMARY KEY (`Id`),
                          KEY `OrgId` (`OrgId`),
                          CONSTRAINT `Groups_ibfk_1` FOREIGN KEY (`OrgId`) REFERENCES `Organisations` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci