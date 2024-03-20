import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-router.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use('/api',router)
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://suryaimmadisetty5252:CKzJbPBeztCAwmEU@cluster0.l9oi4dw.mongodb.net/').then(()=>{
    app.listen(PORT);
    console.log('database is connected');
}).catch((err)=> console.log(err));

//CKzJbPBeztCAwmEU
// mongodb+srv://suryaimmadisetty5252:<password>@cluster0.l9oi4dw.mongodb.net/
