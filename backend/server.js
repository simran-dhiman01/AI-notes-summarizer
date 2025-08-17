import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";



const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/summarize", aiRoutes);
app.use("/api/send-email", emailRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("API Working");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on Port : ${PORT}`);
});
