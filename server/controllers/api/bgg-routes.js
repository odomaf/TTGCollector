const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

router.get("/search/:query", async (req, res) => {
  try {
    const response = await axios.get(
      `https://boardgamegeek.com/xmlapi2/search?query=${req.params.query}&type=boardgame`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BGG_API_TOKEN}`
        }
      }
    );
    // Process response...
    res.json(processedData);
  } catch (error) {
    res.status(500).json({ error: "External API error" });
  }
});

module.exports = router;