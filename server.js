// ======================================
// animeTIME SERVER - JIKAN + SEARCH
// ======================================

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// ===== GET NEWS (PAGINATION) =====
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
      description: anime.synopsis || "لا يوجد وصف.",
      anime: anime.title,
      date: anime.aired?.from
        ? anime.aired.from.split("T")[0]
        : "غير محدد",
      image: anime.images?.jpg?.large_image_url
    }));

    res.json({
      page,
      limit,
      total: data.pagination.items.total,
      data: formatted
    });

  } catch {
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
      description: anime.synopsis || "لا يوجد وصف.",
      anime: anime.title,
      date: anime.aired?.from
        ? anime.aired.from.split("T")[0]
        : "غير محدد",
      image: anime.images?.jpg?.large_image_url
    }));

    res.json({ data: formatted });

  } catch {
    res.status(500).json({ error: "Search failed" });
  }
});

// ===== TEST =====
app.get("/", (req, res) => {
  res.send("animeTIME server running ✅");
});

// ===== START =====
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});