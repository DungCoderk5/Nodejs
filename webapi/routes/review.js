var express = require('express');
var router = express.Router();
const reviewController = require('../mongo/controller/review.controller');

router.post('/reviews', async (req, res) => {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating) {
        return res.status(400).json({
            status: false,
            message: "Thiếu thông tin bắt buộc (userId, productId, rating)."
        });
    }

    try {
        const reviewData = { userId, productId, rating, comment };
        const newReview = await reviewController.createReview(reviewData);

        return res.status(201).json({
            status: true,
            message: "Tạo đánh giá thành công",
            review: newReview
        });

    } catch (error) {
        console.error("Lỗi khi tạo đánh giá:", error);

        return res.status(500).json({
            status: false,
            message: "Lỗi hệ thống khi tạo đánh giá"
        });
    }
});
module.exports = router;