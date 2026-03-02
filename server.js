const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// يخدم الملفات الثابتة
app.use(express.static(path.join(__dirname)));

// ===== API NEWS =====
app.get("/api/news", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const response = await fetch(
      `https://api.jikan.moe/v4/anime?page=${page}&limit=${limit}`,
      { headers: { "User-Agent": "animeTIME" } }
    );

    const data = await response.json();

    const formatted = data.data.map(anime => ({
      title: anime.title,
      description: anime.synopsis || "No description available.",
      date: anime.aired?.from
        ? anime.aired.from.split("T")[0]
        : "Unknown",
      image: anime.images?.jpg?.large_image_url
    }));

    res.json({ page, data: formatted });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ===== SEARCH =====
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ data: [] });

    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&limit=10`,
      { headers: { "User-Agent": "animeTIME" } }
    );

    const data = await response.json();

    const formatted = data.data.map(anime => ({
      title: anime.title,
      description: anime.synopsis || "No description available.",
      date: anime.aired?.from
        ? anime.aired.from.split("T")[0]
        : "Unknown",
      image: anime.images?.jpg?.large_image_url
    }));

    res.json({ data: formatted });

  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ===== الصفحة الرئيسية فقط =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== PORT =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("animeTIME server is running");
});