require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const logger = require("./middleware/logger");
const errors = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1); // Render terminates HTTPS in front of us
app.use(helmet());
app.use(express.json());
// app.use(mongoSanitize()) crashes on Express 5 (req.query is read-only), so strip $-keys from the body in place
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  next();
});
app.use(logger);

app.get("/", (req, res) => {
  res.send("TechFest API is running...");
});
app.use("/api/events", require("./routes/events"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/registrations", require("./routes/registrations"));

app.use(errors.notFound);
app.use(errors.errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/techfest";

if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error("DB error:", err.message);
      process.exit(1);
    });
}

module.exports = app;
