const express = require('express');
const router = express.Router();
const { checkoutOrder } = require('../mongo/controller/order.controller');

// POST /checkout
router.post('/checkout', async (req, res) => {
  try {
    const { userId, voucherId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "Thiếu userId" });
    }

    // Gọi hàm checkoutOrder
    const result = await checkoutOrder(userId, voucherId);

    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

module.exports = router;
