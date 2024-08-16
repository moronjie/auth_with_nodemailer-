import mongoose from "mongoose";

export const connect = (url:string) => {
    return mongoose.connect(url, { dbName: "RESTAPI-with-ts" });
}