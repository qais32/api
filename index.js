import express from "express";
import axios from "axios";
import ytSearch from "yt-search";

const app = express();
const PORT = process.env.PORT || 8080;

// Spotify data
async function getSpotifyData(url) {
  try {
    const res = await axios.get(`https://open.spotify.com/oembed?url=${url}`);
    let title = res.data.title || "";
    return title.replace(" - song by", "").trim();
  } catch {
    return null;
  }
}

// YouTube search
async function searchYouTube(query) {
  const result = await ytSearch(query);
  return result.videos[0] || null;
}

// API
app.get("/download", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.json({ error: "No URL" });

  const track = await getSpotifyData(url);
  if (!track) return res.json({ error: "Invalid link" });

  const video = await searchYouTube(track);
  if (!video) return res.json({ error: "No match" });

  res.json({
    title: track,
    youtube: video.url
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
