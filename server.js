import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
        },
        credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', userRouter);

// app.use('/api',categoryRouter)
const PORT = process.env.PORT || 5001;

app.get('/api/verifyToken', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token', error: err })
        }
        res.status(200).send({ message: 'Token is invalid' })
    })
})

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('database is connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => console.error('could not connect to MonogoDB', err));

//CKzJbPBeztCAwmEU
// mongodb+srv://suryaimmadisetty5252:<password>@cluster0.l9oi4dw.mongodb.net/
