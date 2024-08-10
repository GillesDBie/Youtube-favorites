import dotenv from "dotenv";
dotenv.config();
import express from "express";
import ejs from "ejs";
import { error } from "console";
import { Video } from "./types";
import { videoCollection, youtubeDB } from "./database";

const app = express(); // set app
app.set("port", 3000); //set port
app.set("view engine", "ejs"); //set ejs as view engine

app.use(express.static("public")); //acces public folder

app.get("/", async (req, res) => {
  try {
    const videos: Video[] = await videoCollection.find().toArray();
    res.render("index", {videos});
  } catch (Error) {}
});

async function fetchYoutubeJson(): Promise<void> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/similonap/json/master/videos.json"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    let videos: Video[] = data.videos.map((video: Video) => ({
      title: video.title,
      url: video.url,
      description: video.description,
      rating: video.rating,
    }));
    if ((await videoCollection.countDocuments()) === 0) {
      videoCollection.insertMany(videos);
      console.log("API data inserted into MongoDB collection");
    } else {
      console.log("There are already documents in the collection.");
    }
  } catch (error) {
    console.error(error);
  }
}
app.listen(app.get("port"), () => {
  console.log("[server] http://localhost:" + app.get("port")); //check if app is running
  fetchYoutubeJson();
});
