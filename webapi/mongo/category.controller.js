// thực hiện thao tác CRUD với collection categories
const categoryModel = require('./category.model')
const productModel = require('./product.model')
module.exports = { getAllcate, addCategory, updateaCate, deleteCate,getCateById}
// lấy toàn bộ dữ liệu
async function getAllcate() {
    try {
        const result = await categoryModel.find()
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi lấy dữ liệu");
    }
}
async function getCateById(id) {
    try {
        const cate = await categoryModel.findById(id);
        console.log(cate);

        return cate;
        
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu');
    }
}
async function addCategory(data) {
    try {
        const { ten, quocgia } = data;
        if (!ten?.trim() || !quocgia?.trim()) {
            throw new Error("Tên và Quốc gia không được để trống");

        }
        const newCate = new categoryModel({
            ten: ten.trim(),
            quocgia: quocgia.trim()
        })
        return await newCate.save();
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi thêm dữ liệu");
    }
}
async function updateaCate(data, id) {
    try {
        const { ten, quocgia } = data;
        if (!ten?.trim() || !quocgia?.trim()) {
            throw new Error("Tên và Quốc gia không được để trống");
        }

        const cateFind = await categoryModel.findById(id);
        if (!cateFind) {
            throw new Error("Không tìm thấy dữ liệu");
        }

        const update = await categoryModel.findByIdAndUpdate(
            id,
            {
                ten: ten.trim(),
                quocgia: quocgia.trim()
            },
            { new: true }
        );

        return update;
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi cập nhật dữ liệu");
    }
}
//xóa
async function deleteCate(id) {
    try {
        const cateFind = await categoryModel.findById(id);
        if (!cateFind) {
            throw new Error("Không tìm thấy danh mục cần xóa");
        }
        // kiểm tra danh mục còn sản phẩm không
        const pro = await productModel.find({ 'thuonghieu.thuonghieu_id': id })
        if (pro.length > 0) {
            throw new Error("Danh mục này có sản phẩm, không thể xóa");
        }



        const deleteCate = await categoryModel.findByIdAndDelete(id);
        if (!deleteCate) {
            throw new Error("Không thể xóa vì không tìm thấy danh mục");
        }

        return deleteCate;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}



