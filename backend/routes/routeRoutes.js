const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const { findRoute, getStops } = require("../controllers/routeControllers");

// APIs
router.route("/find-route").get(userController.protect, findRoute);
router.route("/stops").get(userController.protect, getStops);

module.exports = router;
