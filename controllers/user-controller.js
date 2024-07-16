import { Resend } from 'resend';
import User from '../model/User'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto'

// let crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);

const JWT_SECRET_KEY = secretKey
console.log(JWT_SECRET_KEY);
const resend = new Resend('re_Z7aZJzzu_CNgWWbeNbwHJF87rM72pACfY7');

const generateOTP = () => {
    // Generate a random 8-digit OTP
    const otp = Math.floor(10000000 + Math.random() * 90000000);
    console.log(otp.toString())
    return otp.toString();
}

const Signup = async(req,res,next) => {
    const {name,email,password} = req.body;
    console.log('request body',req.body);
    if(!name || !email || !password){
        return res.status(400).json({message:'All fields are required.'})
    }
    let existingUser;

    try {
        existingUser = await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }

    if (existingUser) {
        return res.status(400).json({message:'user already exists! login please'})
    }

    const hashedPassword = bcrypt.hashSync(password)
    const otp = generateOTP()

    const user = new User({
        name,email,password:hashedPassword,verificationCode:otp
    });

    try{
        await user.save();
        // const otp = generateOTP();
        await resend.emails.send({
            from: 'suryaimmadisetty5252@gmail.com',
            to: [email],
            subject: 'Email Verification',
            html: `<p>Hi ${name},</p><p>your verification code is : <strong>${otp}</strong></p>`
        });

        return res.status(201).json({message:'User created successfully. Please check your email for verification.'})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Internal server error'})
    }
    // return res.status(201).json({message:user})
}

const Login = async(req,res,next)=>{
    const {email,password}=req.body;

    console.log('Login request:', req.body);

    let existingUser;

    try {
        existingUser = await User.findOne({email:email});
    } catch (error) {
        console.log('Error finding user:',error);
        return res.status(500).json({message:'Internal server error'})
    }

    if (!existingUser) {
        return res.status(400).json({message:'User not found! Signup please'});
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);

    if(!isPasswordCorrect){
        return res.status(400).json({message:'Invalid email and password '});
    }
    const token = jwt.sign({id: existingUser._id},JWT_SECRET_KEY,{expiresIn:'36000s'});

    res.cookie(String(existingUser._id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000*30),
        httpOnly:true,
        sameSite: 'lax'
    })

    return res.status(200).json({message:'Successfully Logged In',user:existingUser,token});
};

const verifyToken = async(req,res,next)=>{
    // const cookies = req.headers.cookie;
    const authHeader = req.headers['authorization'];
    // const token = cookies.split("=")[1];
    const token = authHeader?.split(' ')[1]
    // console.log(token);

    // const headers = req.headers[authorization]
    // console.log(headers);
    // const token = headers.split(" ")[1];
    if (!token) {
        res.status(403).json({message:'no token provided'})
    }
    jwt.verify(token,JWT_SECRET_KEY,(err,user)=>{
        if (err) {
            // return res.status(400).json({message:"invalid token"})
            // return res.status(403).send({ message: 'Failed to authenticate token' });
            return res.status(500).send({ message: 'Ffailed to authenticate token' });
        }
        // console.log(user.id);
        req.id = user.id;
        next();
    });
};

const getUser = async(req,res,next) =>{
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId,"-password")
    } catch (err) {
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:'user not found'})
    }
    return res.status(200).json({user})
}

const verifyOtp = async(req,res,next) =>{
    const{email,otp} = req.body;
    let user;
    try {
        // user = await User.findOne({email});
        user = await User.findOne({email:email});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'internal server error'})
    }

    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    if(user.verificationCode !== otp){
        return res.status(400).json({message:"invalid otp"})
    }
    user.isVerified = true;
    user.verificationCode = null;
    try {
        await user.save();
        return res.status(200).json({message:"email verification successful"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"})
    }
}

export {Signup,Login,verifyToken,getUser,verifyOtp};