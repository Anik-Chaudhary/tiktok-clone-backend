import mongoose from "mongoose";

const tiktokSchema = mongoose.Schema({
  url: String,
  caption: String,
  channel: String,
  song: String,
  likes: String,
  shares: String,
  messages: String,
  description: String,
});

// Collection inside the database
export default mongoose.model("tiktokVideos", tiktokSchema);
