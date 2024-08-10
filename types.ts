import { ObjectId } from "bson";

export interface Video {
  _id?: ObjectId;
  title: string;
  url: string;
  description: string;
  rating: number;
}

export interface User {
  _id?: ObjectId;
  username: string;
  password?: string;
  role: "ADMIN" | "USER";
}