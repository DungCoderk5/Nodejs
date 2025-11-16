const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const voucherSchema = new Schema({
  code: { type: String, required: true },
  loai_giam: { type: String, enum: ["percent", "fixed"], required: true },
  giam_gia: { type: Number, required: true },
  ngay_bat_dau: { type: Date, required: true },
  ngay_ket_thuc: { type: Date, required: true },
  so_luong: { type: Number, required: true },
  dieu_kien: { type: Number, required: true, default: 0 },
  userId: { type: ObjectId, ref: "user", default: null },
});
module.exports =
  mongoose.models.voucher || mongoose.model("voucher", voucherSchema);
