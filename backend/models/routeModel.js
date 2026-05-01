const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeName: String,
  source: String,
  destination: String,

  stops: [
    {
      name: String,
      order: Number
    }
  ],

  interchangeStops: [String],

  buses: [
    {
      busNumber: String,
      startTime: String
    }
  ]
});

module.exports = mongoose.model("Route", routeSchema, "bus-data");