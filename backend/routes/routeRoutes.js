const express = require("express");
const router = express.Router();

const {
  findRoute,
  getStops
} = require("../controllers/routeControllers");

// APIs
router.get("/find-route", findRoute);
router.get("/stops", getStops);

module.exports = router;