import dotenv from "dotenv";
dotenv.config();
import { uri } from "./database";
import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
import { User } from "./types";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: process.env.MONGODB_URI ?? uri ,
    collection: "Sessions",
    databaseName: "YoutubeDB",
});

mongoStore.on("error", (error) => {
    console.error(error);
});

declare module 'express-session' {
    export interface SessionData {
        user?: User;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: false,
    saveUninitialized: false,
});