import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

const MattressService = {
    // Get all mattresses (for the "Yours" tab)
    getAllMattresses: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/mattress`);
            console.log('Get all mattresses response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get all mattresses error:', error);
            throw error;
        }
    },
    
    // Get mattress by ID
    getMattressById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/mattress/${id}`);
            console.log('Get mattress by ID response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Get mattress by ID error for ID ${id}:`, error);
            throw error;
        }
    },
    
    // Get mattress logs by mattress ID
    getMattressLogs: async (mattressId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/mattress/${mattressId}/log`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Get mattress logs response:', response.data);
            
            // Check if the response is an array or wrapped in a data property
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            } else {
                console.error('Unexpected logs response format:', response.data);
                // If no logs are returned, use sample logs for testing
                return MattressService.getSampleLogs(mattressId);
            }
        } catch (error) {
            console.error(`Get mattress logs error for mattress ID ${mattressId}:`, error);
            // If there's an error, use sample logs for testing
            return MattressService.getSampleLogs(mattressId);
        }
    },
    
    // Generate sample logs for testing purposes
    getSampleLogs: (mattressId) => {
        console.log('Using sample logs for testing');
        return [
            {
                id: "5fd8cf6b-e87f-4880-870e-e2a42766edae",
                mattressId: mattressId,
                status: 0,
                details: JSON.stringify({
                    Detail: "New Mattress Created",
                    result: {
                        Uid: mattressId,
                        OrgId: "3e176182-beca-11ef-a25f-0242ac180002",
                        Status: 0,
                        BatchNo: "",
                        EpcCode: "",
                        location: "Test RFID",
                        DaysToRotate: 90,
                        LifeCyclesEnd: "2025-03-05T00:00:00",
                        MattressTypeId: "bad2da04-d7fe-11ef-8ca2-0242ac130002",
                        ProductionDate: "2025-03-05T00:00:00+00:00",
                        MattressTypeName: "King Size"
                    },
                    TimeStamp: "2025-03-05T17:36:37.2984301+00:00"
                }),
                type: 0,
                timeStamp: "05/03/2025 17:36:37"
            },
            {
                id: "e8dbe0bc-9323-4bf9-a2f8-cd95d8624b8c",
                mattressId: mattressId,
                status: 5,
                details: JSON.stringify({
                    New: 3,
                    Detail: "Updated Mattress Status",
                    Original: 0,
                    TimeStamp: "2025-03-06T12:58:44.4122663+00:00"
                }),
                type: 0,
                timeStamp: "06/03/2025 12:58:44"
            },
            {
                id: "aad9f8e6-f4bb-4129-ada2-4fd7d375c8f4",
                mattressId: mattressId,
                status: 4,
                details: JSON.stringify({
                    New: "Test RFIDD",
                    Detail: "Updated Mattress Location",
                    Original: "Test RFID",
                    TimeStamp: "2025-03-06T12:59:07.8703918+00:00"
                }),
                type: 0,
                timeStamp: "06/03/2025 12:59:08"
            },
            {
                id: "d47de0d4-1477-45c1-adb6-736d4950410a",
                mattressId: mattressId,
                status: 4,
                details: JSON.stringify({
                    New: "Log Testing",
                    Detail: "Updated Mattress Location",
                    Original: "Test RFIDD",
                    TimeStamp: "2025-03-06T12:59:24.4030706+00:00"
                }),
                type: 0,
                timeStamp: "06/03/2025 12:59:24"
            },
            {
                id: "2e8768b6-0137-45ce-ba70-5d70cdfeeda2",
                mattressId: mattressId,
                status: 5,
                details: JSON.stringify({
                    New: 0,
                    Detail: "Updated Mattress Status",
                    Original: 3,
                    TimeStamp: "2025-03-06T12:59:37.0333839+00:00"
                }),
                type: 0,
                timeStamp: "06/03/2025 12:59:37"
            }
        ];
    },
    
    // Helper function to convert status code to readable string
    getStatusString: (statusCode) => {
        // Updated to match Backend.Common.Enums.MattressStatus
        const statusMap = {
            0: 'In Production',
            1: 'In Inventory',
            2: 'Assigned',
            3: 'In Use',
            4: 'Needs Cleaning',
            5: 'Decommissioned',
            6: 'In Transit',
            7: 'Rotation Needed'
        };
        
        return statusMap[statusCode] || 'Unknown';
    },
    
    // Helper function to get status color
    getStatusColor: (statusCode) => {
        const colorMap = {
            0: 'info',     // In Production
            1: 'info',     // In Inventory
            2: 'success',  // Assigned
            3: 'success',  // In Use
            4: 'warning',  // Needs Cleaning
            5: 'error',    // Decommissioned
            6: 'info',     // In Transit
            7: 'warning'   // Rotation Needed
        };
        
        return colorMap[statusCode] || 'default';
    },

    // Update mattress details (status and location)
    updateMattress: async (id, mattressData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${BASE_URL}/api/mattress/${id}`, mattressData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Update mattress response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Error updating mattress with ID ${id}:`, error);
            throw error;
        }
    }
};

export default MattressService; 