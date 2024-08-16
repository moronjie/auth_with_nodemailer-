import dotenv from 'dotenv'
dotenv.config()

export default {
    mongoURI: process.env.DB_URL,
    secret: process.env.JWT_SECRET || "secret",
    port: process.env.PORT
}