import { Express } from "express";
import user from "../../src/routes/user.route"
import task from "../../src/routes/task.route"

export const appRoutes = (app:Express) => {
    app.use("/api/users", user);
    app.use("/api/tasks", task);
}