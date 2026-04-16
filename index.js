import express from "express";
import axios from "axios";
import ytSearch from "yt-search";
import ytdl from "@distube/ytdl-core";

const app = express();
const PORT = process.env.PORT || 8080;

// 🎧 Extract Spotify data properly
async function getSpotifyData(url) {
  try {
    const res = await axios.get(`https://open.spotify.com/oembed?url=${url}`);
    let title = res.data.title || "";

    // Clean title (remove " - song by artist")
    title = title.replace(" - song by", "").trim();

    return title;
  } catch (err) {
    return null;
  }
}

// 🔍 Better YouTube search
async function searchYouTube(query) {
  const result = await ytSearch(query);

  // better filtering
  const video = result.videos.find(v =>
    v.title.toLowerCase().includes(query.split(" ")[0].toLowerCase())
  );

  return video || result.videos[0] || null;
}

// 🎵 API
app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.send("No URL");

  try {
    const track = await getSpotifyData(url);
    if (!track) return res.send("Invalid Spotify link");

    const video = await searchYouTube(track);
    if (!video) return res.send("No match found");

    const stream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
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
