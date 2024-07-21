import Category from "../model/Category.js";
import User from "../model/User.js";

const getCategories = async (req,res) => {
  const {page = 1,itemsPerPage = 6} = req.query;
  try {
    const categories = await Category.find()
      .skip((page-1) * itemsPerPage)
      .limit(parseInt(itemsPerPage));
    
      const totalCategories = await Category.countDocuments();
      
      res.json({
      categories,
      totalCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCategories / itemsPerPage)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal server error'});
  }
};

const getSelectedCategories = async (req,res) => {
  const userId  =req.id;
  console.log("hi?")
  try {
    const user = await User.findById(userId).select('selectedCategories');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ selectedCategories: user.selectedCategories})
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server Error'})
  }
};

const updateSelectedCategories = async(req,res) => {
  const userId = req.id;
  const { selectedCategories } = req.body;

  console.log('Request received:',  {userId:userId, selectedCategories:selectedCategories} );

  try {
    if (!Array.isArray(selectedCategories)) {
      console.log('Invalid categories format');
      return res.status(400).json({ message: 'Invalid categories format' });
    }

    const user = await User.findByIdAndUpdate(userId, {selectedCategories:selectedCategories}, {new:true});
    
    if(!user){
      console.log('User not found');
      return res.status(404).json({message:'user not found'})
    }
    res.json({message: 'Categories updated',selectedCategories: user.selectedCategories});
  } catch (error) {
    console.error('Error updating categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export {getCategories,getSelectedCategories,updateSelectedCategories}