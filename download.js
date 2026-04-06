const axios = require('axios');

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Browser jab check karne ke liye OPTIONS bhejta hai
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sirf POST method allow hai.' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL missing hai.' });
    }

    try {
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: url,
            vQuality: '720',
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ 
            error: 'Media fetch nahi ho saka.', 
            details: error.response ? error.response.data : error.message 
        });
    }
}
