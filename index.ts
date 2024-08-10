import dotenv from "dotenv";
dotenv.config();
import express from "express";
import ejs from "ejs";
import bcrypt from "bcrypt";
import session from "./session";
import { MemoryStore } from "express-session";
import { error } from "console";
import { Video, User } from "./types";
import { secureMiddleware } from "./secureMiddleware";
import {
  client,
  videoCollection,
  youtubeDB,
  userCollection,
  createInitialUser,
  login,
} from "./database";

const app = express(); // set app
app.set("port", 3000); //set port
app.set("view engine", "ejs"); //set ejs as view engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);
app.use(express.static("public")); //acces public folder

app.get("/", secureMiddleware, async (req, res) => {
  const videos: Video[] = await videoCollection.find().toArray();
  res.render("home", { videos, user: req.session.user });
});

app.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (Error) {
    console.error(Error);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    let user: User = await login(username, password);
    delete user.password;
    req.session.user = user;
    res.redirect("/");
  } catch (e: any) {
    res.redirect("/login");
  }
});

app.get("/logout", async (req, res) => {
  try {
    delete req.session.user;
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

app.get("/create", secureMiddleware, async (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  try {
    const newVideo: Video = {
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      rating: req.body.rating,
    };

    await videoCollection.insertOne(newVideo);
    console.log("New video inserted");

    res.redirect("/");
  } catch (error) {
    console.error("Error inserting video:", error);
    res.status(500).send("Internal Server Error");
  }
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
  console.log("[server] http://localhost:" + app.get("port"));
  fetchYoutubeJson();
  createInitialUser();
});
