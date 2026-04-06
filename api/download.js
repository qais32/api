import axios from "axios";

export default async function handler(req, res) {
    // =========================
    // 🌍 CORS HEADERS
    // =========================
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Only POST method allowed"
        });
    }

    try {
        const { url } = req.body;

        // =========================
        // 🧪 VALIDATION
        // =========================
        if (!url) {
            return res.status(400).json({
                success: false,
                error: "URL is required"
            });
        }

        if (!url.startsWith("http")) {
            return res.status(400).json({
                success: false,
                error: "Invalid URL format"
            });
        }

        // ❌ Block YouTube (Cobalt unsupported)
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            return res.status(400).json({
                success: false,
                error: "YouTube is not supported with Cobalt API"
            });
        }

        // =========================
        // 🚀 COBALT API REQUEST
        // =========================
        const response = await axios.post(
            "https://api.cobalt.tools/",
            {
                url: url
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 20000
            }
        );

        const data = response.data;

        // =========================
        // 🔍 FLEXIBLE RESPONSE PARSER
        // =========================
        let downloadUrl = null;

        // Case 1
        if (data?.url) {
            downloadUrl = data.url;
        }

        // Case 2
        else if (data?.streams && data.streams.length > 0) {
            downloadUrl = data.streams[0].url;
        }

        // Case 3 (future safe)
        else if (data?.data?.url) {
            downloadUrl = data.data.url;
        }

        if (!downloadUrl) {
            return res.status(500).json({
                success: false,
                error: "No download link found",
                raw: data
            });
        }

        // =========================
        // ✅ SUCCESS RESPONSE
        // =========================
        return res.status(200).json({
            success: true,
            url: downloadUrl
        });

    } catch (error) {

        // =========================
        // ❌ ERROR HANDLING
        // =========================
        return res.status(500).json({
            success: false,
            error: "Failed to fetch from Cobalt",
            details: error.response?.data || error.message
        });
    }
}
