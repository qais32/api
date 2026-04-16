import express from "express";
import axios from "axios";
import ytSearch from "yt-search";
import ytdl from "@distube/ytdl-core";

const app = express();
const PORT = process.env.PORT || 8080;

// Spotify → title extract
async function getSpotifyTrack(url) {
  try {
    const res = await axios.get(`https://open.spotify.com/oembed?url=${url}`);
    return res.data.title;
  } catch {
    return null;
  }
}

// YouTube search
async function searchYouTube(query) {
  const result = await ytSearch(query);
  return result.videos.length > 0 ? result.videos[0] : null;
}

// MAIN API
app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.send("No URL");

  try {
    const track = await getSpotifyTrack(url);
    if (!track) return res.send("Invalid Spotify link");

    const video = await searchYouTube(track);
    if (!video) return res.send("No match");

    const stream = ytdl(video.url, {
      filter: "audioonly",
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9"
        }
      }
    });

    res.header("Content-Disposition", `attachment; filename="${track}.mp3"`);
    res.header("Content-Type", "audio/mpeg");

    stream.pipe(res);

  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
