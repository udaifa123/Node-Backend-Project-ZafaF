const Razorpay=require("razorpay");

const createRazorpayOrder=async(req,res)=>{
    const{amount}=req.body;

    const instance=new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET,
    });

    const options={
        amount:amount * 100,
        currency:"INR",
        receipt:"receipt_"+Date.now(),
    };

    try{
        const order=await instance.orders.create(options);
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};
module.exports={createRazorpayOrder}