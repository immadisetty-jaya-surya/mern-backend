import { Resend } from 'resend';
import User from '../model/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = 'my-secret-key'
const resend = new Resend('');

const generateOTP = () => {
    // Generate a random 8-digit OTP
    const otp = Math.floor(10000000 + Math.random() * 90000000);
    return otp.toString();
}

const Signup = async(req,res,next) => {
    const {name,email,password} = req.body;

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

    const user = new User({
        name,email,password:hashedPassword
    });

    try{
        await user.save();
        
        const otp = generateOTP();
        resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'email verification',
        html: `<p>Hi ${name},</p><p>your verification code is : <strong>${otp}</strong></p>`
        });

        return res.status(201).json({message:'User created successfully. Please check your email for verification.'})
    }catch(error){
        console.log(error);
        // return res.status(500).json({message:'Internal server error'})
    }
    return res.status(201).json({message:user})
}

const Login = async(req,res,next)=>{
    const {email,password}=req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email:email});
    } catch (error) {
        return new Error(error)
    }

    if (!existingUser) {
        return res.status(400).json({message:'User not found! Signup please'});
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);

    if(!isPasswordCorrect){
        return res.status(400).json({message:'Invalid email and password '});
    }
    const token = jwt.sign({id: existingUser._id},JWT_SECRET_KEY,{expiresIn:'30s'});

    res.cookie(String(existingUser._id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000*30),
        httpOnly:true,
        sameSite: 'lax'
    })

    return res.status(200).json({message:'Successfully Logged In',user:existingUser,token});
};

const verifyToken = async(req,res,next)=>{
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    console.log(token);

    // const headers = req.headers[`authorization`]
    // console.log(headers);
    // const token = headers.split(" ")[1];
    if (!token) {
        res.status(404).json({message:'no token found'})
    }
    jwt.verify(String(token),JWT_SECRET_KEY,(err,user)=>{
        if (err) {
            return res.status(400).json({message:"invalid token"})
        }
        // console.log(user.id);
        req.id = user.id;
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
        user = await User.findOne({email});
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

    try {
        await user.save();
        return res.status(200).json({message:"email verification successful"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"})
    }
}


export {Signup,Login,verifyToken,getUser,verifyOtp};
