require('dotenv').config();
const axios = require('axios');

const exchangeCodeForToken = async (authorizationCode) => {
    try {
        const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
            params: {
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                redirect_uri: process.env.ZOHO_REDIRECT_URI,
                code: authorizationCode,
                grant_type: 'authorization_code'
            }
        });
        console.log(response.data, 'response');
        return response.data.access_token;
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = exchangeCodeForToken;
