const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
    },
  ],
  cartTotal: { type: Number, required: true }, // tổng tiền trước giảm
  discount: { type: Number, default: 0 }, // giảm giá từ voucher
  finalPrice: { type: Number, required: true }, // tổng tiền sau giảm
  voucherUsed: {
    voucherId: { type: Schema.Types.ObjectId, ref: "Voucher" },
    appliedAt: { type: Date },
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled", "shipped", "completed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "momo", "bank"],
    default: "cash",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Tự động cập nhật updatedAt khi save
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
