var express = require('express');
const mongoose = require("mongoose");

var router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  };
  return cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: checkfile });
const productController = require('../mongo/controller/product.controller');
// const productModel = require('../mongo/product.model')
router.get('/', async (req, res) => {
  try {
    const products = await productController.getAllproduct();
    // res.render('product', { products }); 
    return res.status(200).json({ status: true, products });

  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi lấy dữ liệu");
  }
});
router.get("/products-by-brand/:brandId",productController.getProductsByBrand);

router.get("/phantrang", async (req, res) => {
  try {
      const { page, limit } = req.query;
      const currentPage = parseInt(page) || 1;
      const perPage = parseInt(limit) || 5;

      const result = await productController.getPhantrang(currentPage, perPage);

      return res.status(200).json({
          status: true,
          products: result.products,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
      });
  } catch (error) {
      console.error("❌ Lỗi API:", error);
      return res.status(500).json({ status: false, message: "Lỗi server", error: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
      const { search } = req.query; // Lấy từ khóa từ query string
      if (!search || search.trim() === "") {
          return res.status(400).json({ status: false, message: "Vui lòng nhập từ khóa tìm kiếm" });
      }

      const products = await productController.searchProduct(search);
      return res.status(200).json({ status: true, products });
  } catch (error) {
      console.error("❌ Lỗi API:", error);
      return res.status(500).json({ status: false, message: "Lỗi server", error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productController.getProById(id);

    if (!product) {
      return res.status(404).send("Sản phẩm không tồn tại");
    }

    // res.render('product_detail', { product }); 
    return res.status(200).json({ status: true, product });

  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi lấy dữ liệu");
  }
});



router.post("/addpro", upload.fields([
  { name: "hinh", maxCount: 1 },
  { name: "thumbnails", maxCount: 3 }
]), async (req, res) => {
  try {
    console.log("🔥 Dữ liệu nhận từ request body:", req.body);
    console.log("📂 Files nhận từ request:", req.files);

    // Kiểm tra ảnh có được tải lên không
    if (!req.files.hinh || req.files.hinh.length === 0) {
      throw new Error("Không có hình chính nào được tải lên!");
    }
    if (!req.files.thumbnails || req.files.thumbnails.length !== 3) {
      throw new Error("Cần tải lên đúng 3 hình thumbnails!");
    }

    // Kiểm tra và log tinh_chat trước khi xử lý
    console.log("📌 Giá trị tinh_chat trước khi xử lý:", req.body.tinh_chat);

    // Lấy dữ liệu từ request body
    const { ten, gia, gia_km, mota, soluongtonkho, thuonghieu_id, tinh_chat, hot, an_hien, trangthai } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !ten?.trim() ||
      gia === undefined ||
      gia_km === undefined ||
      !mota?.trim() ||
      soluongtonkho === undefined ||
      !thuonghieu_id ||
      an_hien === undefined ||
      trangthai === undefined
    ) {
      throw new Error("Thiếu thông tin sản phẩm!");
    }

    // Kiểm tra ID thương hiệu hợp lệ
    if (!mongoose.Types.ObjectId.isValid(thuonghieu_id)) {
      throw new Error("ID thương hiệu không hợp lệ!");
    }

    // Tạo đối tượng dữ liệu
    const data = {
      ten: ten.trim(),
      gia: Number(gia),
      gia_km: Number(gia_km),
      mota: mota.trim(),
      soluongtonkho: Number(soluongtonkho),
      thuonghieu_id,
      hinh: req.files.hinh[0].filename,
      thumbnails: req.files.thumbnails.map(file => file.filename),
      tinh_chat: Number(tinh_chat),
      hot: hot === "true",
      an_hien: an_hien === "true",
      trangthai: Number(trangthai)
    };

    console.log("📌 Dữ liệu gửi đến Controller:", data);

    // Gửi dữ liệu đến Controller
    const result = await productController.addproduct(data);

    console.log("✅ Kết quả trả về từ Controller:", result);

    return res.status(200).json({ status: true, result });

  } catch (error) {
    console.error("🔥 Lỗi khi thêm sản phẩm:", error);
    return res.status(500).json({ log: error.message, status: false, message: "Lỗi thêm sản phẩm" });
  }
});



// cập nhật
router.put("/update/:id", upload.single('hinh'), async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: `ID sản phẩm không hợp lệ: ${id}` });
    }

    const data = req.body;
    const file = req.file;

    if (file) {
      data.hinh = file.originalname;
    }

    console.log("📌 Dữ liệu nhận từ client:", data); // Debug

    const result = await productController.updateproduct(data, id);
    return res.status(200).json({ status: true, result });

  } catch (error) {
    console.error("🔥 Lỗi cập nhật sản phẩm:", error);
    return res.status(500).json({ log: error.message, status: false, message: "Lỗi cập nhật sản phẩm" });
  }
});

//xóa
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productController.deleteProduct(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.error("🔥 Lỗi xóa sản phẩm:", error);
    return res.status(500).json({
      log: error.message,
      status: false,
      message: "Lỗi xóa sản phẩm",
    });
  }
});

router.get('/related-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productController.getRelatedProducts(id);
    return res.status(200).json({ status: true, products });

  } catch (error) {
    return res.status(500).json({ status: false, message: 'lỗi', log: error.message });
  }
});
router.get('/list', async (req, res) => {
  try {
    const { page, limit } = req.query;

    const products = await productController.getProductsPaginated(page, limit);
    return res.status(200).json({ status: true, products });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return res.status(500).json({ status: false, message: 'Lỗi lấy dữ liệu', log: error.message });
  }
});




module.exports = router;
