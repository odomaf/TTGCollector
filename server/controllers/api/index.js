const router = require('express').Router();
const gameRoutes = require("./game-routes");
const bggRoutes = require("./bgg-routes");
const authRoutes = require("./auth-routes");

router.use("/", gameRoutes);
router.use("/bgg", bggRoutes); // New BGG routes
router.use("/auth", authRoutes); // Authentication routes (signup, login, logout)

module.exports = router;