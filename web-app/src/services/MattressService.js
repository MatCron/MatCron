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
        // Updated to match Backend.Common.Enums.MattressStatus
        const colorMap = {
            0: 'info',     // In Production - blue
            1: 'default',  // In Inventory - gray
            2: 'primary',  // Assigned - blue
            3: 'success',  // In Use - green
            4: 'warning',  // Needs Cleaning - yellow/orange
            5: 'error',    // Decommissioned - red
            6: 'info',     // In Transit - blue
            7: 'warning'   // Rotation Needed - yellow/orange
        };
        
        return colorMap[statusCode] || 'default';
    }
};

export default MattressService; 