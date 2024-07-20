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
        type: String,
        default: null
    },
    selectedCategories:{
        type: [String],
        default:[]
    }
})

export default mongoose.model('User',userSchema);
