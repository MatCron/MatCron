-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               9.1.0 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for matcron_db
CREATE DATABASE IF NOT EXISTS `matcron_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `matcron_db`;

-- Dumping structure for table matcron_db.Groups
CREATE TABLE `Groups` (
                          `Id` char(36) NOT NULL DEFAULT (uuid()),
                          `ReceiverOrgId` char(36) NOT NULL,
                          `SenderOrgId` char(36) DEFAULT NULL,
                          `Name` varchar(100) NOT NULL,
                          `Description` text,
                          `Status` tinyint NOT NULL DEFAULT '0',
                          `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          `ModifiedDate` datetime DEFAULT NULL,
                          `TransferOutPurpose` tinyint DEFAULT NULL,
                          PRIMARY KEY (`Id`),
                          KEY `OrgId` (`ReceiverOrgId`),
                          KEY `Groups_ibfk_SenderOrg` (`SenderOrgId`),
                          CONSTRAINT `Groups_ibfk_ReceiverOrg` FOREIGN KEY (`ReceiverOrgId`) REFERENCES `Organisations` (`Id`) ON DELETE CASCADE,
                          CONSTRAINT `Groups_ibfk_SenderOrg` FOREIGN KEY (`SenderOrgId`) REFERENCES `Organisations` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- Dumping structure for table matcron_db.LocationMattresses
CREATE TABLE IF NOT EXISTS `LocationMattresses` (
                                                    `Id` char(36) NOT NULL DEFAULT (uuid()),
    `Name` varchar(100) NOT NULL,
    `Description` varchar(500) DEFAULT NULL,
    `Status` tinyint(1) NOT NULL DEFAULT '1',
    PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matcron_db.LocationMattresses: ~0 rows (approximately)
DELETE FROM `LocationMattresses`;

-- Dumping structure for table matcron_db.LogMattresses
CREATE TABLE IF NOT EXISTS `LogMattresses` (
                                               `Id` char(36) NOT NULL DEFAULT (uuid()),
    `MattressId` char(36) NOT NULL,
    `Status` varchar(50) NOT NULL,
    `Details` varchar(500) DEFAULT NULL,
    `Type` varchar(50) NOT NULL,
    `TimeStamp` datetime NOT NULL,
    PRIMARY KEY (`Id`),
    KEY `MattressId` (`MattressId`),
    CONSTRAINT `LogMattresses_ibfk_1` FOREIGN KEY (`MattressId`) REFERENCES `Mattresses` (`Uid`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matcron_db.LogMattresses: ~0 rows (approximately)
DELETE FROM `LogMattresses`;

-- Dumping structure for table matcron_db.Mattresses
CREATE TABLE IF NOT EXISTS `Mattresses` (
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
    KEY `OrgId` (`OrgId`),
    KEY `LocationId` (`LocationId`),
    CONSTRAINT `Mattresses_ibfk_1` FOREIGN KEY (`MattressTypeId`) REFERENCES `MattressTypes` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `Mattresses_ibfk_2` FOREIGN KEY (`OrgId`) REFERENCES `Organisations` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `Mattresses_ibfk_3` FOREIGN KEY (`LocationId`) REFERENCES `LocationMattresses` (`Id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matcron_db.Mattresses: ~0 rows (approximately)
DELETE FROM `Mattresses`;

-- Dumping structure for table matcron_db.MattressGroups
CREATE TABLE `MattressGroups` (
                                  `MattressId` char(36) NOT NULL,
                                  `GroupId` char(36) NOT NULL,
                                  `DateAssociated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  `DateDisassociated` datetime DEFAULT NULL,
                                  PRIMARY KEY (`MattressId`,`GroupId`),
                                  KEY `GroupId` (`GroupId`),
                                  CONSTRAINT `MattressGroups_ibfk_1` FOREIGN KEY (`MattressId`) REFERENCES `Mattresses` (`Uid`) ON DELETE CASCADE,
                                  CONSTRAINT `MattressGroups_ibfk_2` FOREIGN KEY (`GroupId`) REFERENCES `Groups` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- Dumping data for table matcron_db.MattressGroups: ~0 rows (approximately)
DELETE FROM `MattressGroups`;

-- Dumping structure for table matcron_db.MattressTypes
CREATE TABLE IF NOT EXISTS `MattressTypes` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matcron_db.MattressTypes: ~0 rows (approximately)
DELETE FROM `MattressTypes`;

-- Dumping structure for table matcron_db.Organisations
CREATE TABLE IF NOT EXISTS `Organisations` (
                                               `Id` char(36) NOT NULL DEFAULT (uuid()),
    `Name` varchar(100) DEFAULT NULL,
    `Email` varchar(100) DEFAULT NULL,
    `Description` text,
    `PostalAddress` text,
    `NormalAddress` text,
    `WebsiteLink` text,
    `Eir` varchar(50) DEFAULT NULL,
    `County` varchar(50) DEFAULT NULL,
    `Logo` text,
    `RegistrationNo` varchar(100) DEFAULT NULL,
    `OrganisationType` varchar(50) DEFAULT NULL,
    `OrganisationCode` varchar(50) NOT NULL,
    PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matcron_db.Organisations: ~1 rows (approximately)
DELETE FROM `Organisations`;
INSERT INTO `Organisations` (`Id`, `Name`, `Email`, `Description`, `PostalAddress`, `NormalAddress`, `WebsiteLink`, `Logo`, `RegistrationNo`, `OrganisationType`, `OrganisationCode`) VALUES
    ('3e176182-beca-11ef-a25f-0242ac180002', 'Dev Organisation', 'dev@example.com', 'A development organization for testing purposes.', '123 Dev Street, Tech City, 12345', '123 Dev Street, Tech City, 12345', 'https://www.devorganisation.com', 'dev-logo.png', 'DEV-123456', 'Development', 'DEV123');

-- Dumping structure for table matcron_db.Users
CREATE TABLE IF NOT EXISTS `Users` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matcron_db.Users: ~1 rows (approximately)
DELETE FROM `Users`;
INSERT INTO `Users` (`Id`, `OrgId`, `GroupId`, `FirstName`, `LastName`, `Password`, `Email`, `EmailVerified`, `UserType`, `ProfilePicture`, `Token`) VALUES
    ('7897945f-77b2-4b24-8f1a-179a68a0a7f0', '3e176182-beca-11ef-a25f-0242ac180002', NULL, 'Joasdhn', 'Doeasd', '47967c40d33dd50155c726eb55e88b60c4878463ed206ed9b4247783d370e8f1', 'johndoe@example.com', 0, 1, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;