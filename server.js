const http = require("http");
const app = require("./src/app");
const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const seedAdmin = require("./src/seeder/adminSeeder");

const PORT = env.server.port;

// Create and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    const server = http.createServer(app);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}, accessible via LAN`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
