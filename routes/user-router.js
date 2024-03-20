import express from 'express';
import { Signup, Login, verifyToken, getUser, verifyOtp} from '../controllers/user-controller.js';


const router = express.Router();

router.post('/Signup',Signup);
router.post('/Login',Login);
router.post('/verifyOtp',verifyOtp);
router.get('/user',verifyToken,getUser);

// module.exports = router
export default router

