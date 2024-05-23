const axios = require('axios');
const getClientCredentialsToken = require('./zohoAuth');

const zohoApiRequest = async (endpoint, method = 'POST', data = null) => {
    const accessToken = await getClientCredentialsToken();
    
    const config = {
        method: method,
        url: `https://www.zohoapis.com/${endpoint}`,
        headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`
        },
        data: data
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`Error making API request to ${endpoint}:`, error.response.data);
        throw error;
    }
};

module.exports = zohoApiRequest;
