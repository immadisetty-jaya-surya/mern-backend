import  mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 10
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    verificationCode:{
        type: String
    }
})

// module.exports = mongoose.model('User',userSchema);

export default mongoose.model('User',userSchema);

//users