import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

const UserService = {
    getOrganizationUsers: async (orgId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/Users/organization/${orgId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching organization users:', error);
            throw error;
        }
    },
    
    inviteUser: async (email, userRole, orgId) => {
        try {
            const token = localStorage.getItem('token');
            
            // Create the request payload according to EmailInvitationDto
            const payload = {
                email: email,
                userRole: userRole, // This should be a byte value (0, 1, or 2)
                orgId: orgId
            };
            
            console.log('Sending invitation request with payload:', payload);
            console.log('To endpoint:', `${BASE_URL}/api/email/invite`);
            console.log('With token:', token ? 'Token exists' : 'No token');
            
            const response = await axios.post(`${BASE_URL}/api/email/invite`, 
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('Invitation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error inviting user:', error);
            console.error('Error details:', error.response ? error.response.data : 'No response data');
            throw error;
        }
    }
};

export default UserService; 