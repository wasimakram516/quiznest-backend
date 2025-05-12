const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const gameRoutes = require("./routes/gameRoutes");
const playerRoutes = require("./routes/playerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const translateRoutes = require("./routes/translateRoutes");
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/translate", translateRoutes);
// Health Check
app.get("/", (req, res) => {
  console.log("📡 QuizNest Server is running...");
  res.status(200).send("QuizNest Server is running...");
});

// Error Handler
app.use(errorHandler);

module.exports = app;
