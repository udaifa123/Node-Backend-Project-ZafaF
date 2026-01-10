// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const { errorHandler } = require("./middleware/errorMiddleware");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));

// // Error middleware
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const { errorHandler } = require("./middleware/errorMiddleware");

// dotenv.config();
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads")); // serve uploaded images

// // Routes
// app.use("/api/users", require("./routes/userAuthRoutes"));
// app.use("/api/products", require("./routes/productRoutes")); // product upload handled here
// app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/wishlist", require("./routes/wishlistRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/payment", require("./routes/paymentRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/admin", require("./routes/adminAuthRoutes"));

// // Error middleware
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const { errorHandler } = require("./middleware/errorMiddleware");

// dotenv.config();
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // ✅ AUTH ROUTES (SEPARATED)
// app.use("/api/users", require("./routes/userAuthRoutes"));
// app.use("/api/admin", require("./routes/adminAuthRoutes"));

// // ✅ APP ROUTES
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/wishlist", require("./routes/wishlistRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/payment", require("./routes/paymentRoutes"));

// // Error middleware
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const paypalRoutes = require("./routes/paypalRoutes");
const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "https://node-backend-project-zafaf-1.onrender.com/api",
      "https://zafaf-frontend.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);



app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).send("Zafaf Backend API is running 🚀");
});


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userAuthRoutes"));
app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/admin",require("./routes/adminProductRoutes"));
app.use("/api/admin",require("./routes/adminRoutes"));
app.use("/api/admin", require("./routes/adminUserRoutes"));
app.use("/api/admin", require("./routes/adminOrderRoutes"));
app.use("/api/admin", require("./routes/adminRevenueRoutes"));
app.use("/api/admin", require("./routes/adminStatsRoutes"));
app.use("/api/admin/analytics",require("./routes/adminAnalyticsRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));



app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use("/api/paypal", require("./routes/paypalRoutes"));


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
