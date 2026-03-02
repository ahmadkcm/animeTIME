const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// يخدم جميع الملفات الثابتة
app.use(express.static(path.join(__dirname)));

// أي مسار غير API يرجع index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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

// ===== PORT =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("animeTIME server is running");
});