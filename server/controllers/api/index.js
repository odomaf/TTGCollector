const router = require('express').Router();
const gameRoutes = require("./game-routes");
const bggRoutes = require("./bgg-routes");

router.use("/", gameRoutes);
router.use("/bgg", bggRoutes); // New BGG routes

module.exports = router;