const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL missing" });

    try {
        // YouTube ke liye Direct fix
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            const ytRes = await axios.get(`https://api.vevioz.com/api/button/videos/${videoId}`);
            // Note: Ye ek public API hai jo direct download button return karti hai
            return res.status(200).json({ url: `https://api.vevioz.com/api/button/videos/${videoId}` });
        } 
        
        // Baki sab ke liye (Pinterest, TikTok)
        const response = await axios.post('https://api.cobalt.tools/', {
            url: url,
            videoQuality: '720'
        }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ error: "Download failed", details: error.message });
    }
};
