
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline/promises");
const User = require("./models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    const name = await rl.question("Enter Admin Name: ");
    const email = await rl.question("Enter Admin Email: ");
    const mobile = await rl.question("Enter Admin Mobile: ");
    const password = await rl.question("Create Admin Password: ");

    if (!name || !email || !mobile || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 8) {
      throw new Error("Password must contain at least 8 characters");
    }

    const existingAdmin = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingAdmin) {
      throw new Error("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      password: hashedPassword,
      role: "admin",
      isApproved: true
    });

    console.log("Admin account created successfully!");

  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

createAdmin();
