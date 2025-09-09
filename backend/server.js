import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/post.route.js"
import userRoutes from "./routes/user.route.js"


// dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);

app.use(express.static( "uploads"));



const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://kkhokale15:komallinkora@cluster0.nbiaw0e.mongodb.net/"
  );

  app.listen(8080, () => {
    console.log("Server running on port 8080");
  });
};
start();
