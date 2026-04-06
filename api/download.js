const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL missing" });

    try {
        // Cobalt API is best for YouTube
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: url,
            vQuality: '720', // Best for speed and stability
            vCodec: 'h264'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ error: "YouTube fetch failed", details: error.message });
    }
}
