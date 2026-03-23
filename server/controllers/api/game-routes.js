const router = require("express").Router();
const { getGames, addGame } = require("../game-controller");

// Define routes for games
router.route("/").get(getGames);
//router.route("/:id").get(getGameById);
router.route("/").post(addGame);
//router.route("/:id").put(updateGame);
//router.route("/:id").delete(deleteGame);

module.exports = router;
