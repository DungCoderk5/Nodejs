
// kết nối collection categories
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const productSchema = new Schema({
    ten: { type: String, required: true },
    gia: { type: Number, required: true },
    gia_km: { type: Number, required: true },
    hinh: { type: String, required: false }, // Không bắt buộc
    soluongtonkho: { type: Number, required: true },
    hot: { type: Boolean, required: false },
    an_hien: { type: Boolean, required: false },
    thuonghieu: {
        thuonghieu_id: { type: ObjectId, required: true },
        thuonghieuName: { type: String, required: true },
        thuonghieuNation: { type: String, required: true }
    },
    thumbnails: { type: [String], required: false }, // Không bắt buộc
    mota: { type: String, required: true },
    tinh_chat: { type: Number, required: false },
    trangthai: {type:Number, required:false},
});
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.models.product ||
    mongoose.model('product', productSchema)

