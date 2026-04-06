const axios = require('axios');

export default async function handler(req, res) {
    // CORS Headers taake aapki shared hosting se request aa sake
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Cobalt API (Sabse stable downloader engine)
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: url,
            vQuality: '720',
            filenameStyle: 'basic'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Media fetch fail ho gaya. Link check karein.' });
    }
}
