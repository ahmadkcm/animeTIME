// ======================================
// animeTIME - Anime + Gaming News
// ======================================

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

const NEWS_KEY = "cabdf6f4255d4a97a809075c6d1aec23";

// ===== ANIME NEWS =====
app.get("/api/anime", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?page=1&limit=6`
    );
    const data = await response.json();

    const formatted = data.data.map(a => ({
      type: "anime",
      title: a.title,
      image: a.images?.jpg?.large_image_url || 
             "https://via.placeholder.com/400x250?text=Anime",
      description: a.synopsis?.substring(0,200) || 
                   "No description available.",
      link: a.url
    }));

    res.json({ data: formatted });

  } catch (err) {
    res.status(500).json({ error: "Anime fetch failed" });
  }
});

// ===== GAMING NEWS =====
app.get("/api/gaming", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=gaming OR video games&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_KEY}`
    );

    const data = await response.json();

    const formatted = data.articles.slice(0, 6).map(n => ({
      type: "gaming",
      title: n.title,
      image: n.urlToImage || 
             "https://via.placeholder.com/400x250?text=Gaming+News",
      description: n.description || 
                   "No description available.",
      link: n.url
    }));

    res.json({ data: formatted });

  } catch (err) {
    res.status(500).json({ error: "Gaming fetch failed" });
  }
});

// ===== HOME =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 animeTIME running");
});