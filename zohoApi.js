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

const getOrganizationId = async (accessToken) => {
    try {
        const response = await axios.get('https://www.zohoapis.in/books/v3/organizations', {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Accept': 'application/json'
            }
        });
        const organizations = response.data.organizations;
        if (organizations && organizations.length > 0) {
            return organizations[0].organization_id; // Assuming you want the first organization
        } else {
            throw new Error('No organizations found');
        }
    } catch (error) {
        console.error('Error fetching organization ID:', error);
        throw error;
    }
};

module.exports = {zohoApiRequest, getOrganizationId};
