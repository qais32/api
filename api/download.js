// Axios ko safe tareeke se import karein
const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Only POST allowed" });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is missing" });
    }

    try {
        // Cobalt API Latest Endpoint
        const response = await axios.post('https://api.cobalt.tools/', {
            url: url,
            videoQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 seconds timeout
        });

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("API Error:", error.message);
        return res.status(500).json({ 
            error: "Fetch failed", 
            message: error.response ? error.response.data : error.message 
        });
    }
};
