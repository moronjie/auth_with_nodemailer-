import { Express } from "express";
import auth from "../routes/auth.route"
import task from "../../src/routes/task.route"

export const appRoutes = (app:Express) => {
    app.use("/api/auth", auth);
    app.use("/api/tasks", task);
}