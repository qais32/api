import express from "express";
import axios from "axios";
import ytSearch from "yt-search";
import ytdl from "@distube/ytdl-core";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🎧 Extract Spotify track info
async function getSpotifyTrack(url) {
  try {
    const oembed = await axios.get(`https://open.spotify.com/oembed?url=${url}`);
    const title = oembed.data.title;

    // Example: "Song Name - Artist"
    return title;
  } catch (err) {
    return null;
  }
}

// 🔍 Search on YouTube
async function searchYouTube(query) {
  const res = await ytSearch(query);
  return res.videos.length > 0 ? res.videos[0] : null;
}

// 🎵 API route
app.get("/download", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.json({ error: "No URL provided" });

  try {
    const track = await getSpotifyTrack(url);
    if (!track) return res.json({ error: "Invalid Spotify link" });

    const video = await searchYouTube(track);
    if (!video) return res.json({ error: "No match found" });

    const audioStream = ytdl(video.url, {
      filter: "audioonly"
    });

    res.header("Content-Disposition", `attachment; filename="${track}.mp3"`);
    res.header("Content-Type", "audio/mpeg");

    audioStream.pipe(res);

  } catch (err) {
    res.json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
