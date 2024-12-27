namespace Backend.Common.Enums;
public enum GroupStatus : byte
    {
        Active = 1,
        Archived = 2
       
    }

    public enum ProcessStatus : byte
    {
        None = 0,
        TransferredOut = 1, 
        TransferredIn = 2   
        
    }