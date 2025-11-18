const Order = require('../model/order.model');
const User = require('../model/user.model');
const Voucher = require('../model/voucher.model');
const Cart = require('../model/cart.model');

async function checkoutOrder(userId, voucherId = null) {
  try {
    // 1. Lấy user
    const user = await User.findById(userId);
    if (!user) throw new Error("Người dùng không tồn tại");

    // 2. Lấy tất cả sản phẩm trong cart của user
    const cartItems = await Cart.find({ userID: userId });
    if (!cartItems || cartItems.length === 0) throw new Error("Giỏ hàng trống");

    // 3. Tính tổng tiền cart
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + (item.gia_km || item.gia) * item.soluong,
      0
    );

    let discount = 0;
    let finalPrice = cartTotal;
    let voucherUsedData = null;

    // 4. Nếu có voucher
    if (voucherId) {
      const voucher = await Voucher.findById(voucherId);
      if (!voucher) throw new Error("Voucher không tồn tại");

      // Kiểm tra user đã dùng voucher chưa
      user.usedVouchers = user.usedVouchers || [];
      if (user.usedVouchers.includes(voucher._id.toString())) {
        throw new Error("Bạn đã sử dụng voucher này rồi");
      }

      // Kiểm tra số lượng
      if (voucher.so_luong <= 0) throw new Error("Voucher đã hết lượt sử dụng");

      // Kiểm tra hạn sử dụng
      const now = new Date();
      if (now < voucher.ngay_bat_dau || now > voucher.ngay_ket_thuc) {
        throw new Error("Voucher đã hết hạn hoặc chưa bắt đầu");
      }

      // Kiểm tra điều kiện áp dụng
      if (cartTotal < voucher.dieu_kien) {
        throw new Error(`Đơn hàng phải tối thiểu ${voucher.dieu_kien} để dùng voucher`);
      }

      // Tính giảm giá
      if (voucher.loai_giam === "percent") discount = cartTotal * (voucher.giam_gia / 100);
      else if (voucher.loai_giam === "fixed") discount = voucher.giam_gia;

      finalPrice = Math.max(cartTotal - discount, 0);

      // Cập nhật voucher đã dùng và giảm số lượng
      user.usedVouchers.push(voucher._id);
      await user.save();

      voucher.so_luong -= 1;
      await voucher.save();

      voucherUsedData = { voucherId: voucher._id, appliedAt: new Date() };
    }

    // 5. Tạo order
    const order = new Order({
      userId: user._id,
      products: cartItems.map(item => ({
        productId: item.productID,
        quantity: item.soluong,
        size: item.size,
        price: item.gia_km || item.gia
      })),
      cartTotal,
      discount,
      finalPrice,
      voucherUsed: voucherUsedData,
      status: 'paid',          // thanh toán thành công
      paymentMethod: 'card'    // bạn có thể truyền vào
    });

    await order.save();

    // 6. Xoá tất cả sản phẩm trong cart của user
    await Cart.deleteMany({ userID: userId });

    return { message: "Thanh toán thành công", order };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Lỗi thanh toán");
  }
}

module.exports = { checkoutOrder };
