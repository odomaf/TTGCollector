const router = require("express").Router();
const { Op } = require("sequelize");
const sequelize = require("../config/connection");
const { Game, Category, Mechanic } = require("../models");

// POST /addGame
router.post("/addGame", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const newGame = await Game.create(
      {
        name: req.body.name,
        min_players: req.body.min_players,
        max_players: req.body.max_players,
        thumbnail: req.body.thumbnail,
        description: req.body.description,
        published: req.body.published,
        bgg_id: req.body.bgg_id,
        minplaytime: req.body.minplaytime,
        maxplaytime: req.body.maxplaytime,
        minage: req.body.minage,
      },
      { transaction },
    );

    const categoryNames = Array.isArray(req.body.categories)
      ? req.body.categories.filter(Boolean)
      : [];
    const mechanicNames = Array.isArray(req.body.mechanics)
      ? req.body.mechanics.filter(Boolean)
      : [];

    if (categoryNames.length > 0) {
      const matchedCategories = await Category.findAll({
        where: {
          category: {
            [Op.in]: categoryNames,
          },
        },
        transaction,
      });

      if (matchedCategories.length > 0) {
        await newGame.addCategories(matchedCategories, { transaction });
      }
    }

    if (mechanicNames.length > 0) {
      const matchedMechanics = await Mechanic.findAll({
        where: {
          mechanic: {
            [Op.in]: mechanicNames,
          },
        },
        transaction,
      });

      if (matchedMechanics.length > 0) {
        await newGame.addMechanics(matchedMechanics, { transaction });
      }
    }

    const createdGame = await Game.findByPk(newGame.id, {
      include: [Category, Mechanic],
      transaction,
    });

    await transaction.commit();
    res.status(201).json(createdGame);
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
