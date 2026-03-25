const router = require("express").Router();
const { Op } = require("sequelize");
const sequelize = require("../config/connection");
const { Game, Category, Mechanic, User, UserGame } = require("../models");

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

    // Associate the game with the current user
    // Check if user is logged in (session has userId)
    if (req.session.userId) {
      // Create a record in user_games table to attach the game to the user
      await UserGame.create(
        {
          user_id: req.session.userId,
          game_id: newGame.id,
        },
        { transaction },
      );
      console.log(`Game associated with user ${req.session.userId}`);
    } else {
      // If no user session, rollback the transaction
      await transaction.rollback();
      return res.status(401).json({ error: "User not authenticated" });
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

// GET /categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["category", "ASC"]] });
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to retrieve categories: ${err.message}` });
  }
});

// GET /mechanics
router.get("/mechanics", async (req, res) => {
  try {
    const mechanics = await Mechanic.findAll({ order: [["mechanic", "ASC"]] });
    res.status(200).json(mechanics);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to retrieve mechanics: ${err.message}` });
  }
});

// GET /getGames
// Returns only games associated with the logged-in user
// Uses the user_games join table to filter by user
router.get("/", async (req, res) => {
  try {
    // Check if user is logged in (session has userId)
    if (!req.session.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log("GET / called, session ID:", req.sessionID);
    console.log("GET / userId from session:", req.session.userId);

    // Find the user with their associated games
    // Use the "Games" alias defined in the association (models/index.js)
    const user = await User.findByPk(req.session.userId, {
      include: {
        association: "Games",
        through: { attributes: [] }, // Don't return join table fields
        include: [Category, Mechanic],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user.username, user.id);
    console.log("Raw user.Games:", user.Games);

    // user.Games is an array of games associated with this user
    const games = user.Games || [];
    console.log(`Games found for user ${req.session.userId}: ${games.length}`);
    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: `Failed to retrieve games ${err.message}` });
  }
});

module.exports = router;
