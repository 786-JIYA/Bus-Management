const express = require("express");
const app = express();

const connectDB = require("./backend/config/db");
const routeRoutes = require("./backend/routes/routeRoutes");


require("dotenv").config();

const cors = require("cors");
app.use(cors());

// Middleware
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/", routeRoutes);

// Server


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});