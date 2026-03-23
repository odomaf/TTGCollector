const router = require("express").Router();
//const { game } = require('../models');
const sequelize = require("../config/connection");
const { Game } = require("../models");

// POST /addGame
router.post("/addGame", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const newGame = await Game.create(
      {
        name: req.body.name,
        min_players: req.body.min_players,
        max_players: req.body.max_players,
        play_time: req.body.play_time,
      },
      { transaction },
    );
    await transaction.commit();
    res.status(201).json(newGame);
    console.log(`Game added: ${newGame.name}`);
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    res.status(500).json({ error: `Failed to add game ${err.message}` });
  }
});

// GET /getGames
router.get("/", async (req, res) => {
  try {
    console.log("GET / called - fetching all games");
    const games = await Game.findAll();
    console.log("Games found:", games);
    console.log("Number of games:", games.length);
    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: `Failed to retrieve games ${err.message}` });
  }
});

module.exports = router;
