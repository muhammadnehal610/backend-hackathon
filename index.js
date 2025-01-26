import express from 'express'
import connectDB from './config/connectDB.js';
import visitorRoutes from "./routes/visitorRoutes.js";
import userRoute from "./routes/authRoutes.js";
import { configDotenv } from 'dotenv';
import cors from 'cors'
configDotenv()
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // If cookies or auth headers are needed
  })
);
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", userRoute);
app.use("/api/visitor", visitorRoutes);


app.get("/" , (req, res)=>{
  res.send("sever running")
})

// Start Server
const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
