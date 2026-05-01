const Route = require("../models/routeModel");

exports.findRoute = async (req, res) => {
  try {
    let { source, destination } = req.query;

    source = source.trim().toLowerCase();
    destination = destination.trim().toLowerCase();

    const allRoutes = await Route.find();

    // ✅ STEP 1: DIRECT ROUTE CHECK
    for (let r of allRoutes) {
      if (
        r.source.trim().toLowerCase() === source &&
        r.destination.trim().toLowerCase() === destination
      ) {
        return res.json({
          type: "direct",
          route: r.routeName,
          options: r.buses.map(bus => ({
            busNumber: bus.busNumber,
            departure: bus.startTime
          })),
          stops: r.stops.map(s => s.name)
        });
      }
    }

    // ✅ STEP 2: MULTIPLE INTERCHANGE LOGIC
    const results = [];

    for (let r1 of allRoutes) {

      const stops1 = r1.stops.map(s => s.name.toLowerCase());
      const sourceIndex = stops1.indexOf(source);

      if (sourceIndex === -1) continue;

      // 🔥 try stops after source
      for (let i = sourceIndex + 1; i < stops1.length; i++) {

        const interchange = stops1[i];

        // ✅ route1 must END at interchange
        if (r1.destination.toLowerCase() !== interchange) continue;

        for (let r2 of allRoutes) {

          if (r1._id.toString() === r2._id.toString()) continue;

          // ✅ route2 must START from interchange
          if (r2.source.toLowerCase() !== interchange) continue;

          const stops2 = r2.stops.map(s => s.name.toLowerCase());
          const destIndex = stops2.indexOf(destination);

// ❌ must check FIRST
if (destIndex === -1) continue;

// ------------------ SCORING ------------------

const getMinutes = (time) => {
  if (!time || typeof time !== "string") return 0;

  const parts = time.split(":");
  if (parts.length !== 2) return 0;

  const [h, m] = parts.map(Number);
  if (isNaN(h) || isNaN(m)) return 0;

  return h * 60 + m;
};

const startTime =
  r1.buses && r1.buses.length > 0
    ? r1.buses[0].startTime
    : "23:59";

const timePenalty = getMinutes(startTime) / 10;

const totalStops = (r1.stops?.length || 0) + (r2.stops?.length || 0);

const score = (totalStops * 10) + timePenalty;

// 🔥 push ONLY valid routes
results.push({
  changeAt: interchange,
  firstRoute: r1.routeName,
  secondRoute: r2.routeName,
  bus1: r1.buses,
  bus2: r2.buses,
  totalStops,
  score
});

          }
        }
      }
    

          // ✅ STEP 3: RETURN MULTIPLE OPTIONS
        if (results.length > 0) {

          // 🔥 sort (optional but powerful)
        results.sort((a, b) => a.score - b.score);

        return res.json({
        type: "indirect",
        best: results[0],     // 🔥 best route
        options: results      // all routes
      });
    }

    // ❌ NOTHING FOUND
    res.json({
      type: "none",
      message: "No route found"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔥 Get Stops
exports.getStops = async (req, res) => {
  const { routeName } = req.query;

  try {
    const route = await Route.findOne({ routeName });

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    const stops = route.stops
      .sort((a, b) => a.order - b.order)
      .map(s => s.name);

    res.json({
      route: route.routeName,
      stops
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};