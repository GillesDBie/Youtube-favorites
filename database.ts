import { MongoClient } from "mongodb";
import { Video, User } from "./types";
import bcrypt from "bcrypt";

export const uri = process.env.MONGODB_URI ?? ""
export const client = new MongoClient(uri);
export const youtubeDB = client.db("YoutubeDB");
export const videoCollection = youtubeDB.collection<Video>("Videos");
export const userCollection = youtubeDB.collection<User>("Sessions");
export const saltRounds : number = 10;

export async function createInitialUser() {
  if (await userCollection.countDocuments() > 0) {
      return;
  }
  let username : string | undefined = process.env.ADMIN_USERNAME;
  let password : string | undefined = process.env.ADMIN_PASSWORD;
  if (username === undefined || password === undefined) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
  }
  await userCollection.insertOne({
      username: username,
      password: await bcrypt.hash(password, saltRounds),
      role: "ADMIN"
  });
}


export async function login(username: string, password: string) {
  if (username === "" || password === "") {
    throw new Error("Email and password required");
  }
  let user: User | null = await userCollection.findOne<User>({ username: username });
  if (user) {
    if (await bcrypt.compare(password, user.password!)) {
      return user;
    } else {
      throw new Error("Password incorrect");
    }
  } else {
    throw new Error("User not found");
  }
}
