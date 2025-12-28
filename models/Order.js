// const { required } = require("joi");
// const mongoose=require("mongoose");
// const Product = require("./Product");

// const orderSchema=new mongoose.Schema(
//     {
//         user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
//         products:[
//             {
//                 product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
//                 qty:{type:Number,default:1},
//             },
//         ],
//         amount:{type:Number,required:true},
//         paymentId:{type:String},
//         status:{type:String,default:"Pending"},
//     },
//     {timestamps:true}
// );
// module.exports=mongoose.model("Order",orderSchema);






// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   items: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       quantity: Number,
//       price: Number,
//     },
//   ],
//   address: {
//     fullName: String,
//     phone: String,
//     street: String,
//     city: String,
//     state: String,
//     pincode: String,
//   },
//   totalAmount: Number,
//   paymentStatus: {
//     type: String,
//     enum: ["SUCCESS", "FAILED"],
//     default: "FAILED",
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);



const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  orderItems: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: String,
    quantity: Number,
    price: Number,
  },
],

    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
