const voucherModel = require('../model/voucher.model');
const userModel = require('../model/user.model');

module.exports = { getAllVouchers};
async function getAllVouchers() {
    try {
        const result = await voucherModel.find();
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi lấy dữ liệu");
    }
}