import express from "express"
import mongoose from "mongoose";

import {connect} from "./model/connect"
import config from "./config";
import {middlewares} from "./stratup/middlewares"
import { appRoutes } from "./stratup/route";
import { errorHandler } from "./middleware/errorHandler";

const app = express()

const port = config.port || 5001

middlewares(app)
appRoutes(app)

app.use(errorHandler)

connect(config.mongoURI || '')
mongoose.connection.on('error', () => {console.log("something is wrong. Check your internet connection");})

mongoose.connection.once('open', () => {
    app.listen(port, () => { console.log(`app is running on port ${port}`)})
})

