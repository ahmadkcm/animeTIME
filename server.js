// ======================================
// animeTIME - Full Version
// ======================================

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
    const page = req.query.page || 1;

    const response = await fetch(
      `https://api.jikan.moe/v4/anime?page=${page}&limit=8`
    );

    const data = await response.json();

    const formatted = data.data.map(a => ({
      title: a.title,
      image: a.images?.jpg?.large_image_url ||
             "https://via.placeholder.com/400x250?text=Anime",
      description: a.synopsis?.substring(0,200) ||
                   "No description available.",
      link: a.url,
      trailer: a.trailer?.embed_url || null
    }));

    res.json({ data: formatted });

  } catch {
    res.status(500).json({ error: "Anime failed" });
  }
});

// ===== SEARCH ANIME =====
app.get("/api/search-anime", async (req, res) => {
  try {
    const q = req.query.q;

    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${q}&limit=8`
    );

    const data = await response.json();

    const formatted = data.data.map(a => ({
      title: a.title,
      image: a.images?.jpg?.large_image_url ||
             "https://via.placeholder.com/400x250?text=Anime",
      description: a.synopsis?.substring(0,200) ||
                   "No description available.",
      link: a.url,
      trailer: a.trailer?.embed_url || null
    }));

    res.json({ data: formatted });

  } catch {
    res.status(500).json({ error: "Search failed" });
  }
});

// ===== GAMING =====
app.get("/api/gaming", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=gaming OR video games&language=en&page=${page}&pageSize=8&apiKey=${NEWS_KEY}`
    );

    const data = await response.json();

    if (data.status !== "ok") {
      return res.json({ data: [] });
    }

    const formatted = data.articles.map(n => ({
      title: n.title || "No title",
      image: n.urlToImage || 
             "https://via.placeholder.com/400x250?text=Gaming",
      description: n.description || 
                   "No description available.",
      link: n.url || "#"
    }));

    res.json({ data: formatted });

  } catch (err) {
    console.log(err);
    res.json({ data: [] });
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