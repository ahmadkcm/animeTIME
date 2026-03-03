const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

const NEWS_KEY = "cabdf6f4255d4a97a809075c6d1aec23";

// ===== ANIME =====
app.get("/api/anime", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?page=1&limit=6`
    );
    const data = await response.json();

    const formatted = data.data.map(a => ({
      type: "anime",
      title: a.title,
      image: a.images?.jpg?.large_image_url,
      description: a.synopsis?.substring(0,200) || "",
      link: a.url
    }));

    res.json({ data: formatted });
  } catch {
    res.status(500).json({ error: "Anime failed" });
  }
});

// ===== GAMING NEWS =====
app.get("/api/gaming", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=gaming&language=en&pageSize=6&apiKey=${NEWS_KEY}`
    );

    const data = await response.json();

    const formatted = data.articles.map(n => ({
      type: "gaming",
      title: n.title,
      image: n.urlToImage,
      description: n.description || "",
      link: n.url
    }));

    res.json({ data: formatted });

  } catch {
    res.status(500).json({ error: "Gaming failed" });
  }
});

// ===== HOME =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 animeTIME + Gaming News running");
});