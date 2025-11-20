const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ReviewSchema = new Schema(
  {
    productId: { type: ObjectId, required: true, ref: "Product" },
    userId: { type: ObjectId, required: true, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Review", ReviewSchema);