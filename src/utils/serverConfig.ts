export const corsConfig = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "HMAC", "Timestamp"],
    credentials: true
}

export const ServerPort = 3003