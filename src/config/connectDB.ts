
import mongoose from "mongoose";
 export async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/jwt_db");

    console.log("Connect DB successfullsy");
  } catch (e) {
    console.log("Connect DB failure");
  }
}

