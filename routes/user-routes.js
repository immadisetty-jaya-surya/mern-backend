import express from 'express';
import { Signup, Login, verifyToken, getUser, verifyOtp } from '../controllers/user-controller.js';
import { getCategories, getSelectedCategories, updateSelectedCategories } from '../controllers/category-controller.js';

const router = express.Router();

router.post('/Signup', Signup);
router.post('/verifyOtp', verifyOtp);
router.post('/Login', Login);
router.get('/user', verifyToken, getUser);
//categories
router.get('/categories', getCategories);
router.get('/selectedCategories', verifyToken, getSelectedCategories);
router.post('/updateSelectedCategories', verifyToken, updateSelectedCategories);

// module.exports = router
export default router