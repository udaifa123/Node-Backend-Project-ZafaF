const User = require("../models/User");
const Order = require("../models/Order");

exports.getAdminStats = async (req,res)=>{
  try{
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    const revenueData = await Order.aggregate([{ $group:{ _id:null, totalRevenue:{$sum:"$total"} } }]);
    const revenue = revenueData.length>0? revenueData[0].totalRevenue : 0;
    res.json({users, orders, revenue});
  }catch(err){
    res.status(500).json({message:err.message});
  }
}
