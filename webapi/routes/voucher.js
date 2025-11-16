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
module.exports = router;