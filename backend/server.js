import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Book Collection API is running",
    });
});

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected");

if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
}

export default app;