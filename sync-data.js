import mongoose from "mongoose";
import dns from "node:dns";

import data from "./data.js";
import Videos from "./dbModel.js";

const connectionUrl = process.env.MONGODB_URI;

// Atlas connection strings use DNS SRV records. Use public resolvers so this
// does not depend on a local DNS server supporting those lookups.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

if (!connectionUrl) {
  console.error("MONGODB_URI is required to sync data to MongoDB.");
  process.exit(1);
}

try {
  await mongoose.connect(connectionUrl);

  await Videos.deleteMany({});
  const insertedVideos = await Videos.insertMany(data);

  console.log(`Synced ${insertedVideos.length} videos to MongoDB.`);
} catch (error) {
  console.error("MongoDB sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
