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
    
    public enum TransferOutPurpose : byte
    {
        maintainence = 0,
        delivery = 1,
        emergency = 2,
        endOfLifeCycle = 3
    }