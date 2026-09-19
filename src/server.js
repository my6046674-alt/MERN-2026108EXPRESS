import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import cors from "cors";

import productRoute from "./routes/product.routes.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import authRoute from "./routes/auth.route.js";

import connectDB from "./config/database.js";
import logger from "./middlewares/logger.js";
import auth from "./middlewares/auth.js";
import connectCloudinary from "./config/cloudinary.js";
import config from "./config/config.js";
import promptAI from "./utils/ai.js";

const upload = multer({storage: multer.memoryStorage() });
import dns from "node:dns/promises"
dns.setServers(["8.8.8.8", "1.1.1.1"])

const app = express();

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cookieParser());

app.use(logger);
app.use(cors());

app.get("/", (req, res) => {
    res.send("Home page");
});

app.get("/about", (req, res) => {
    res.send("About Page");
});

app.get("/contact", (req, res) => {
    res.send("Contact page");
});

app.use("/api/products", upload.array("images",5) ,productRoute);
app.use("/api/users",auth, upload.single("image"), userRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders",auth, orderRoute);

app.post("/api/ai", async (req, res) => {
    const result = await promptAI(req.body.prompt);
    res.json({ success: true, result });
});

app.listen(config.port, () => {
    console.log(`Server running at port ${config.port}...`)
});

