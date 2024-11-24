
CREATE DATABASE MyDatabase;
GO
USE MyDatabase;
GO


SET ANSI_NULLS ON
GO  
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Organisations](
    [Id] [uniqueidentifier] NOT NULL,
    [Name] [nvarchar](100) NULL,
    [Email] [nvarchar](100) NULL,
    [Description] [nvarchar](max) NULL,
    [PostalAddress] [nvarchar](max) NULL,
    [NormalAddress] [nvarchar](max) NULL,
    [WebsiteLink] [nvarchar](max) NULL,
    [Logo] [nvarchar](max) NULL,
    [RegistrationNo] [nvarchar](100) NULL,
    [OrganisationType] [nvarchar](50) NULL,
    [OrganisationCode] [nvarchar](50) NOT NULL
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
ALTER TABLE [dbo].[Organisations] ADD  CONSTRAINT [PK_Organisations] PRIMARY KEY CLUSTERED
    (
    [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    GO
ALTER TABLE [dbo].[Organisations] ADD  DEFAULT (newid()) FOR [Id]
    GO



-- Below is the Users Table 
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Users](
    [Id] [uniqueidentifier] NOT NULL,
    [OrgId] [uniqueidentifier] NOT NULL,
    [FirstName] [nvarchar](50) NOT NULL,
    [LastName] [nvarchar](50) NOT NULL,
    [Password] [nvarchar](max) NOT NULL,
    [Email] [nvarchar](100) NULL,
    [EmailVerified] [tinyint] NOT NULL,
    [UserType] [tinyint] NULL,
    [ProfilePicture] [nvarchar](max) NULL,
    [Token] [text] Null
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED
    (
    [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (newid()) FOR [Id]
    GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [EmailVerified]
    GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Organisations] FOREIGN KEY([OrgId])
    REFERENCES [dbo].[Organisations] ([Id])
    ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Organisations]
    GO

