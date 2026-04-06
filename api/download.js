const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL missing" });

    try {
        // YouTube ke liye hum ye stable API use karenge
        const options = {
            method: 'GET',
            url: 'https://youtube-video-download-info.p.rapidapi.com/dl',
            params: { id: extractVideoId(url) },
            headers: {
                'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY_HERE', // <-- Yahan apni Key dalein
                'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // Response format fix kar rahe hain taake frontend ko 'url' mil jaye
        if (response.data && response.data.link) {
            // Hum 720p ka link nikal rahe hain
            const downloadUrl = response.data.link['22'] || Object.values(response.data.link)[0];
            return res.status(200).json({ url: downloadUrl });
        } else {
            throw new Error("Video link not found in API response");
        }

    } catch (error) {
        return res.status(500).json({ error: "YouTube Fetch Failed", details: error.message });
    }
}

// YouTube URL se ID nikalne ka function
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
