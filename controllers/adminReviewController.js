const Review = require("../models/Review");

// 🔹 Get ALL reviews (Admin)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Delete review (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
