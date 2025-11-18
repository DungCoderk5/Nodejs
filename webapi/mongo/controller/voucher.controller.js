const voucherModel = require('../model/voucher.model');
const userModel = require('../model/user.model');

module.exports = { getAllVouchers,applyVoucher,checkoutVoucher,getUserUsedVouchers };
async function getAllVouchers() {
    try {
        const result = await voucherModel.find();
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi lấy dữ liệu");
    }
}
// Hàm chung lấy user và voucher, kiểm tra tồn tại
async function getUserAndVoucher(userId, voucherId) {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("Người dùng không tồn tại");

  const voucher = await voucherModel.findById(voucherId);
  if (!voucher) throw new Error("Voucher không tồn tại");

  user.usedVouchers = user.usedVouchers || [];
  return { user, voucher };
}

// Hàm chung kiểm tra user đã dùng voucher chưa và số lượng còn lại
function validateVoucherUsage(user, voucher) {
  if (user.usedVouchers.includes(voucher._id.toString())) {
    throw new Error("Bạn đã sử dụng voucher này rồi");
  }
  if (voucher.so_luong <= 0) {
    throw new Error("Voucher đã hết lượt sử dụng");
  }
}

// Hàm apply voucher (tính giá, kiểm tra điều kiện, KHÔNG giảm số lượng)
async function applyVoucher(userId, voucherId, cartTotal) {
  try {
    const { user, voucher } = await getUserAndVoucher(userId, voucherId);

    // Kiểm tra hạn sử dụng
    const now = new Date();
    if (now < voucher.ngay_bat_dau || now > voucher.ngay_ket_thuc) {
      throw new Error("Voucher đã hết hạn hoặc chưa bắt đầu");
    }

    // Kiểm tra đã dùng & số lượng
    validateVoucherUsage(user, voucher);

    // Kiểm tra điều kiện áp dụng
    if (cartTotal < voucher.dieu_kien) {
      throw new Error(`Đơn hàng phải tối thiểu ${voucher.dieu_kien} để dùng voucher`);
    }

    // Tính giá giảm
    let discount = 0;
    if (voucher.loai_giam === "percent") discount = cartTotal * (voucher.giam_gia / 100);
    else if (voucher.loai_giam === "fixed") discount = voucher.giam_gia;

    const finalPrice = Math.max(cartTotal - discount, 0);

    // Trả kết quả, KHÔNG giảm số lượng voucher
    return { message: "Voucher có thể áp dụng", discount, finalPrice, cartTotal };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Lỗi áp dụng voucher");
  }
}

// Hàm checkoutVoucher (giảm số lượng và ghi nhận user đã dùng)
async function checkoutVoucher(userId, voucherId) {
  try {
    const { user, voucher } = await getUserAndVoucher(userId, voucherId);

    // Kiểm tra đã dùng & số lượng
    validateVoucherUsage(user, voucher);

    // Ghi nhận user đã dùng voucher và giảm số lượng
    user.usedVouchers.push(voucher._id);
    await user.save();

    voucher.so_luong -= 1;
    await voucher.save();

    return { message: "Đã ghi nhận việc sử dụng voucher" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Lỗi ghi nhận sử dụng voucher");
  }
}

//danh sách voucher user đã dùng
async function getUserUsedVouchers(userId) {
  try {
    const user = await userModel.findById(userId).populate('usedVouchers');
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    return user.usedVouchers || [];
    } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy danh sách voucher đã dùng");
  } 
}