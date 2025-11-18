var express = require('express');
var router = express.Router();
const voucherController = require('../mongo/controller/voucher.controller');
// http://localhost:3000/voucher
router.get('/', async (req, res) => {
    try {
        const result = await voucherController.getAllVouchers();
        return res.status(200).json({ status: true, result })
    }
    catch (error) {
        console.log(console.error);
        return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" })
    }
    // res.send('respond with a resource');
});
router.post('/apply-voucher', async (req, res) => {
  try {
    const { userId, voucherId, cartTotal } = req.body;

    if (!userId || !voucherId || cartTotal === undefined) {
      return res.status(400).json({ status: false, message: "Thiếu thông tin bắt buộc" });
    }

    const result = await voucherController.applyVoucher(
      userId,
      voucherId,
      Number(cartTotal) // đảm bảo là number
    );

    return res.status(200).json({ status: true, result });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

router.post('/checkout-voucher', async (req, res) => {
  try {
    const { userId, voucherId } = req.body;

    if (!userId || !voucherId) {
      return res.status(400).json({ status: false, message: "Thiếu thông tin bắt buộc" });
    }

    const result = await voucherController.checkoutVoucher(userId, voucherId);

    return res.status(200).json({ status: true, result });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

router.get('/user-used-vouchers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await voucherController.getUserUsedVouchers(userId);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});
module.exports = router;