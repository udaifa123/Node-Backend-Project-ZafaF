// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const dotenv = require("dotenv");
// const Admin = require("./models/Admin");

// dotenv.config();

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// async function createAdmin() {
//   // Hash the password
//   const hashedPassword = await bcrypt.hash("admin987", 10);

//   // Save admin with hashed password
//   const admin = new Admin({
//     name: "Admin",
//     email: "admin@gmail.com",
//     password: hashedPassword
//   });

//   await admin.save();
//   console.log("Admin created");
//   process.exit();
// }

// createAdmin();
