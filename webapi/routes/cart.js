var express = require('express');
var router = express.Router();
const productModel = require('../mongo/product.model');
const cartController = require('../mongo/cart.controller');
// http://localhost:3000/cart

router.get('/', async (req, res) => {
    try {
        const result = await cartController.getAllCart();
        return res.status(200).json({ status: true, result })
    }
    catch (error) {
        console.log(console.error);
        return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" })
    }
    // res.send('respond with a resource');
});
//thêm sản phẩm vào giỏ hàng
router.post("/addprotocart",async (req, res) => {
    try {
        const { productID, ten, gia, gia_km, soluong, size, userID,hinh } = req.body;
        // const imageUrl = req.file ? `${req.file.filename}` : null; // Lưu đường dẫn ảnh

        // Kiểm tra nếu thiếu user
        if (!userID) {
            return res.status(400).json({ message: "Thiếu thông tin người dùng!" });
        }

        // Kiểm tra sản phẩm có tồn tại trong DB không
        const product = await productModel.findById(productID);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
        }
        if (!hinh) {
            return res.status(400).json({ message: "❌ Chưa có hình ảnh!" });
        }
        // Gửi data vào controller
        const data = { productID, ten, gia, gia_km, soluong, size, hinh, userID };
        const cart = await cartController.addProductToCart(data);

        res.status(200).json({ message: "Đã thêm vào giỏ hàng", cart });
    } catch (error) {
        console.error("🔥 Lỗi khi thêm vào giỏ hàng:", error);
        res.status(500).json({status:false, message: error,log: error.message });
    }
});
// xóa sản phẩm khỏi giỏ hàng
router.delete('/deletecart/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const result = await cartController.deleteCartt(id);
      return res.status(200).json({ status: true, message: "Xóa thành công", result });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          status: false,
          message: "Lỗi xóa dữ liệu",
          log: error.message
      });
  }
});
module.exports = router; 
