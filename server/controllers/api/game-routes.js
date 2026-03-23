const router = require("express").Router();
const homeRoutes = require("../homeRoutes");

// Use the homeRoutes router for game endpoints
router.use("/", homeRoutes);

module.exports = router;
