// kết nối collection categories
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  usedVouchers: [{ type: ObjectId, ref: "voucher" }],
  role: { type: Number, required: true, default: 0 },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});
module.exports = mongoose.models.user || mongoose.model("user", userSchema);
