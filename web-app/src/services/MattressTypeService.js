import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

const MattressTypeService = {
    // Get all mattress types with full details
    getAllMattressTypes: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/mattresstype/display-all-types`);
            console.log('Get all mattress types response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get all mattress types error:', error);
            throw error;
        }
    },
    
    // Get mattress type summaries (for cards/tiles display)
    getMattressTypeSummaries: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/mattresstype/summaries`);
            console.log('Get mattress type summaries response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get mattress type summaries error:', error);
            throw error;
        }
    },
    
    // Get mattress type by ID
    getMattressTypeById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/mattresstype/${id}`);
            console.log('Get mattress type by ID response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Get mattress type by ID error for ID ${id}:`, error);
            throw error;
        }
    },
    
    // Add a new mattress type
    addMattressType: async (mattressTypeData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/mattresstype`, mattressTypeData);
            console.log('Add mattress type response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Add mattress type error:', error);
            throw error;
        }
    },
    
    // Update an existing mattress type
    updateMattressType: async (id, mattressTypeData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/mattresstype/${id}`, mattressTypeData);
            console.log('Update mattress type response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Update mattress type error for ID ${id}:`, error);
            throw error;
        }
    },
    
    // Delete a mattress type
    deleteMattressType: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/mattresstype/${id}`);
            console.log('Delete mattress type response:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Delete mattress type error for ID ${id}:`, error);
            throw error;
        }
    },
    
    // Helper function to format dimensions
    formatDimensions: (width, length, height) => {
        return `${width} × ${length} × ${height} cm`;
    },
    
    // Helper function to convert washable value to readable string
    getWashableString: (washable) => {
        return washable === 1 ? 'Yes' : 'No';
    }
};

export default MattressTypeService; 