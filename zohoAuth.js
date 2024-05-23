require('dotenv').config();
const axios = require('axios');

const getClientCredentialsToken = async () => {
    try {
        const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
            params: {
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                redirect_uri: process.env.ZOHO_REDIRECT_URI,
                grant_type: 'client_credentials',
                scope: 'ZohoCRM.users.ALL'
            }
        });
        console.log(response.data, 'response');
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting client credentials token:', error.response ? error.response.data : error.message);
        throw error;
    }
};


getClientCredentialsToken().catch(err => console.error('Failed to get client credentials token:', err));

module.exports = getClientCredentialsToken;
