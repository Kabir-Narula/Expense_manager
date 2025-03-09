import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'


const app = express();
dotenv.config({path: path.resolve('./.env')});


// Middleware CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use('/api/auth',authRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>{
  connectDB(); 
  console.log(`Server running on port ${PORT}`)
});
