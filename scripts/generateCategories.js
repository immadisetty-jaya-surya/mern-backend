import mongoose from "mongoose";
import dotenv from 'dotenv'
import {faker} from'@faker-js/faker'
import Category from "../model/Category.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URL;
if (!mongoUri) {
  console.error('MongoDB connection string is missing. Please check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('connected to mongoDB');
    generateCategories();
  })
  .catch(err => console.error('could not connect to mongoDB',err));

const generateCategories = async(numCategories = 20) => {
  try {
    await Category.deleteMany({});

    const categories = Array.from({length:100}).map(()=>({
      name: faker.commerce.department(),
      description:faker.commerce.productDescription(),
    }));

    await Category.insertMany(categories);
    console.log('seeded categories successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding categories',error);
    mongoose.disconnect()
  }
}