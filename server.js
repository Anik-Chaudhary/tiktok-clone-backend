import express from "express";
import mongoose from "mongoose";

import data from "./data.js";
import dns from "dns";
import Videos from "./dbModel.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// app config
const app = express();
const port = 9000;

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  (res.setHeaders("Access-Control-Allow-Origin", "*"),
    res.setHeaders("Access-Control-Allow-Headers", "*"),
    next());
});

// DB config
const connection_url =
  "mongodb+srv://anikchaudhary2002_db_user:7vcbtXwCB7AS3Q4p@cluster0.keylsqx.mongodb.net/";

async function startServer() {
  try {
    await mongoose.connect(connection_url);
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`listening on localhost:${port}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// api endpoints
app.get("/", (req, res) => res.status(200).send("99 Bottles of Beer"));

app.get("/v1/posts", (req, res) => res.status(200).send(data));

app.get("/v2/posts", async (req, res) => {
  try {
    const data = await Videos.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/v2/posts", async (req, res) => {
  // POST request is to ADD DATA to the database
  // It will let us ADD a video DOCUMENT to the videos COLLECTION
  const dbVideos = req.body;

  try {
    const data = await Videos.create(dbVideos);
    res.status(201).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

startServer();
