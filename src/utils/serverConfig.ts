const dotenv = require("dotenv");
dotenv.config();

const front = process.env.FRONT_URL || ""

export const corsConfig = {
    origin: [front, "localhost"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "HMAC", "Timestamp"],
    exposedHeaders: ["Authorization"],
    credentials: true
}

export const ServerPort = 3003