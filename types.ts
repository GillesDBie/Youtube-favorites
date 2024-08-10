import { ObjectId } from "bson";

export interface Video {
  _id?: ObjectId;
  title: string;
  url: string;
  description: string;
  rating: number;
}
