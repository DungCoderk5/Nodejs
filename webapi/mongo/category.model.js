
// kết nối collection categories
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    ten:{type: String, required:true},
    quocgia:{type:String, required:true}

});
module.exports = mongoose.models.category ||
mongoose.model('category', categorySchema)

