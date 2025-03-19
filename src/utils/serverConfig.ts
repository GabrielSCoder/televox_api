export const corsConfig = {
    origin: ["https://localhost:5173", "https://192.168.1.13:8080", "https://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "HMAC", "Timestamp"],
    exposedHeaders: ["Authorization"],
    credentials: true
}

export const ServerPort = 3003