import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config()
const app = express();
app.use(cors());

app.use(express.json())




app.get("/", (req, res) => {
    res.send("Hello World")
})

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to DB"))
.catch((error) => console.log(`Failed : ${error.message}`))

app.listen(5050, () => {
    console.log("Backend server is running on localhost")
})