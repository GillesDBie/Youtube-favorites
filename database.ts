import { MongoClient } from "mongodb";
import { Video } from "./types";
export const uri =
  "mongodb+srv://gilles5ecmt:2001RFiafr0@cluster0.q9yuckb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const client = new MongoClient(uri);
export const youtubeDB = client.db("YoutubeDB");
export const videoCollection = youtubeDB.collection<Video>("Videos");
