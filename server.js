import express from "express";
import mongoose from "mongoose";
import dns from "dns";

import data from "./data.js";
import Videos from "./dbModel.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const connectionUrl = process.env.MONGODB_URI;
let databaseConnection;

function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!databaseConnection) {
    databaseConnection = mongoose.connect(connectionUrl);
  }

  return databaseConnection;
}

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req, res) => res.status(200).send("TikTok backend is running"));
app.get("/v1/posts", (req, res) => res.status(200).json(data));

app.get("/v2/posts", async (req, res) => {
  try {
    await connectDatabase();
    res.status(200).json(await Videos.find());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/v2/posts", async (req, res) => {
  try {
    await connectDatabase();
    res.status(201).json(await Videos.create(req.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vercel invokes this Express application as a serverless function.
export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(9000, () => console.log("Listening on http://localhost:9000"));
}
