// const zohoApiRequest = require('./zohoApi');

// const getLeads = async () => {
//     try {
//         const leads = await zohoApiRequest('crm/v2/Leads');
//         console.log('Leads:', leads);
//     } catch (error) {
//         console.error('Error fetching leads:', error);
//     }
// };

// getLeads();

const express = require('express');
const exchangeCodeForToken = require('./exchangeCodeForToken');
const { default: axios } = require('axios');

const app = express();

const leadData = {
    data: [
        {
            "Company": "Zylker",
            "Last_Name": "Davis",
            "First_Name": "John",
            "Email": "john.davis@zylker.com",
            "Phone": "1234567890",
            "Mobile": "0987654321",
            "Lead_Source": "Website",
            // Add other fields as required by your CRM configuration
        }
    ],
    trigger: [
        "approval",
        "workflow",
        "blueprint"
    ]
};

// Route to handle the redirect URL
app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code; // Assuming the authorization code is passed as a query parameter
    console.log('authorizationCode', authorizationCode);
    try {
        const accessToken = await exchangeCodeForToken(authorizationCode);
        // Now you have the access token, you can use it for further API requests
        console.log('Access Token Received: ' + accessToken);
        const leadsResponse = await axios.get('https://www.zohoapis.in/crm/v2/Leads', {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        // const leadsResponse = await axios.get('https://www.zohoapis.in', {
        //     headers: {
        //         'Authorization': `Zoho-oauthtoken ${accessToken}`
        //     }
        // });

        console.log('leadsResponse', leadsResponse);
        // Process the leads data as needed
        const leads = leadsResponse.data.data;
        console.log('Leads:', leads);

        res.send('Data exported successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error exchanging authorization code for access token');
    }
});

// Route handler to initiate the authorization flow
app.get('/authorize', (req, res) => {
    const authorizeUrl = 'https://accounts.zoho.in/oauth/v2/auth';
    const clientId = process.env.ZOHO_CLIENT_ID;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;
    const scope = 'ZohoCRM.users.ALL';
    const responseType = 'code';
    const url = `${authorizeUrl}?scope=${scope}&client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;

    // Log request headers
    console.log('Request Headers:', req.headers);

    res.redirect(url);
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
