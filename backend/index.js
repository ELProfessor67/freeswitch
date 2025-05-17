import "dotenv/config"
import express from "express";
import router from "./routes/index.js"
import ErrorMiddleware from "./middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors"


const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}))

app.use("/api/v1", router)
app.use(ErrorMiddleware);

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})
