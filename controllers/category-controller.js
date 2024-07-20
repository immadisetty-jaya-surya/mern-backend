import Category from "../model/Category.js";
import User from "../model/User.js";

const getCategories = async (req,res) => {
  const {page = 1,itemsPerPage = 6} = req.query;
  try {
    const categories = await Category.find()
      .skip((page-1) * itemsPerPage)
      .limit(parseInt(itemsPerPage));
    res.json({categories})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal server error'});
  }
};

const getSelectedCategories = async (req,res) => {
  const userId  =req.id;
  console.log("hi?")
  try {
    const user = await User.findById(userId);
    res.json({ selectedCategories: user.selectedCategories})
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server Error'})
  }
};

const updateSelectedCategories = async(req,res) => {
  const userId = req.id;
  const { selectedCategories } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId,{ selectedCategories}, {new:true});
    if(!user){
      return res.json(404).json({message:'user not found'})
    }
    res.json({message: 'Categories updated'},{selectedCategories: user.selectedCategories});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export {getCategories,getSelectedCategories,updateSelectedCategories}