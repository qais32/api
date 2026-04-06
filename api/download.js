const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL missing" });

    try {
        // Naya Endpoint: Ab 'api/json' nahi use hota
        const response = await axios.post('https://api.cobalt.tools/', {
            url: url,
            videoQuality: '720',
            filenameStyle: 'basic'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Nayi API ka response format thora mukhtalif ho sakta hai
        return res.status(200).json(response.data);

    } catch (error) {
        // Agar main API fail ho to error details bhejien
        const errorData = error.response ? error.response.data : error.message;
        return res.status(500).json({ 
            error: "Cobalt API v11 Error", 
            details: errorData 
        });
    }
}
