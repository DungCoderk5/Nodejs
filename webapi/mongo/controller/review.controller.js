const reviewModel = require('../model/review.model');
const mongoose = require('mongoose');

module.exports = { createReview };

async function createReview(data) {
  try {
    const { userId, productId, rating, comment } = data;

    if (!userId || !productId || !rating) {
      throw new Error("Thiếu thông tin bắt buộc để tạo đánh giá!");
    }

    const newReview = new reviewModel({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
      rating,
      comment
    });

    const savedReview = await newReview.save();
    return savedReview;

  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    throw new Error(error.message);
  }
}
