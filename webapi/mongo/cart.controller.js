const cartyModel = require('./cart.model')
const productModel = require("../mongo/product.model");

module.exports = { getAllCart, addProductToCart,deleteCartt }

async function getAllCart() {
    try {
        const result = await cartyModel.find()
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Lỗi lấy dữ liệu");
    }

}
//thêm sản phẩm vào cart

async function addProductToCart(data) {
    try {
        const {  ten, gia, gia_km, soluong, size, hinh, userID,productID } = data;

        // Kiểm tra nếu thiếu userId
        if (!userID) {
            throw new Error("Thiếu thông tin người dùng!");
        }
        if(!productID){
            throw new Error("Thiếu thông tin sản phẩm");
        }
        // Kiểm tra giỏ hàng của user có sản phẩm đó chưa
        let cartItem = await cartyModel.findOne({ productID, size, userID });

        if (cartItem) {
            // Nếu sản phẩm đã có trong giỏ, chỉ cần tăng số lượng
            cartItem.soluong += parseInt(soluong);
        } else {
            // Nếu chưa có, thêm mới sản phẩm vào giỏ hàng
            cartItem = new cartyModel({ productID, ten, gia, gia_km, soluong, size, userID, hinh });
        }
        const saveCart = await cartItem.save();
        console.log("✅ Giỏ hàng đã lưu thành công:", saveCart);

        return saveCart;
       
    } catch (error) {
        console.error("🔥 Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        throw new Error(error.message);
    }
}

//xóa giỏ hàng
async function deleteCartt(id) {
    try {
        const cartDelete = await cartyModel.findByIdAndDelete(id);
        if (!cartDelete) {
            throw new Error("Không tìm thấy sản phẩm cần xóa");
        }

        return cartDelete;
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error.message);
        throw new Error(error.message);
    }
}

