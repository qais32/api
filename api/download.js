const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle Options request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.post('https://api.cobalt.tools/', {
            url: url,
            videoQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ 
            error: "Fetch failed", 
            details: error.response ? error.response.data : error.message 
        });
    }
};
