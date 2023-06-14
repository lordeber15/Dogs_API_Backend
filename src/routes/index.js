const { Router } = require("express");
require("dotenv").config();

const dogs = require("./routesDog");
const temperaments = require("./routesTemperaments");
const breeds = require("./routesBreeds");

const router = Router();

router.use("/", dogs);
router.use("/", temperaments);
router.use("/", breeds);

module.exports = router;
