
// kết nối collection categories
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const cartSchema = new Schema({
    ten: { type: String, required: true },
    gia: { type: Number, required: true },
    gia_km: { type: Number, required: true },
    hinh: { type: String, required: true }, // Không bắt buộc
    soluong: { type: Number, required: true },
    size:{type: String, required:true},
    userID:{type: ObjectId, required:true},
    productID:{type: ObjectId, required:true}

});
module.exports = mongoose.models.cart ||
mongoose.model('cart', cartSchema)

