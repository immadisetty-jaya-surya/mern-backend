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

<<<<<<< HEAD:model/User.js
export default mongoose.model('User',userSchema);
=======
export default mongoose.model('User',userSchema);
>>>>>>> 98de6935e56b8cd43a7f920f85945bf3988e9fd8:model/small change User.js
