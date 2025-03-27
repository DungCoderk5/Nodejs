// thực hiện thao tác CRUD với collection categories
const { options } = require('../routes');
const productModel = require('./product.model')
const categoryModel = require('./category.model')
const mongoose = require("mongoose");


module.exports = { getAllproduct,getProById, addproduct, updateproduct, deleteProduct, getRelatedProducts, getProductsPaginated,searchProduct,getPhantrang,getProductsByBrand }
// lấy toàn bộ dữ liệu
async function getAllproduct() {
    try {
        const result = await productModel.find().limit(10).sort({ _id: -1 });
        // select name, price
        const result1 = await productModel.find({}, { ten: 1, gia: 1 });
        // select name, price from product where price >2000000
        const result2 = await productModel.find({
            gia: { $gt: 2000000 }
            // $gt: lớn hơn
            // $lt: nhỏ hơn
            // $gte,$lte
        }, { ten: 1, gia: 1 });
        // select * from product where price >2000000 and quantity <50
        const result3 = await productModel.find({
            $and: [
                { gia: { $lt: 2000000 } },
                { soluongtonkho: { $lt: 50 } }
            ]
        });

        // or[]
        // select * from products like 'dsds
        const result4 = await productModel.find({
            ten: {
                $regex: 'Classic',
                $options: 'i'
            }
        });
        const result5 = await productModel.find({
            hot: true
        });
        // Lấy danh sách sản phẩm theo trang và giới hạn số lượng
        const result6 = await productModel.paginate({}, { page: 1, limit: 10 });
        const result7 = await productModel.find().sort({ _id: -1 });
        return result7;

    } catch (error) {
        console.log(error);
        throw new Error("Lỗi lấy dữ liệu");
    }
}

//hàm phân trang
async function getPhantrang(page = 1, limit = 5) {
  try {
      const skip = (page - 1) * limit;

      const products = await productModel.find({})
          .skip(skip)
          .limit(limit);

      const totalProducts = await productModel.countDocuments();

      return { products, total: totalProducts, page, limit };
  } catch (error) {
      console.error("❌ Lỗi lấy sản phẩm:", error);
      throw new Error("Lỗi server");
  }
}

// Hàm tìm kiếm sản phẩm theo tên
async function searchProduct(keyword) {
  try {
    if (!keyword || keyword.trim() === "") {
        throw new Error("Vui lòng nhập từ khóa tìm kiếm");
    }

    console.log("🔍 Từ khóa tìm kiếm:", keyword); // Kiểm tra keyword nhận được

    const products = await productModel.find({
        ten: {
            $regex: keyword,
            $options: "i",
        },
    });

    console.log("✅ Kết quả tìm kiếm:", products); // Kiểm tra dữ liệu MongoDB trả về

    return products;
} catch (error) {
    console.error("❌ Lỗi tìm kiếm sản phẩm:", error);
    throw new Error("Lỗi server");
}
};

// Lấy tất cả sản phẩm theo thương hiệu
async function getProductsByBrand (req, res) {
  try {
    const thuonghieu_id = req.params.brandId;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(thuonghieu_id)) {
      return res.status(400).json({ success: false, message: "ID thương hiệu không hợp lệ!" });
    }

    const products = await productModel.find({ "thuonghieu.thuonghieu_id": thuonghieu_id });

    if (!products.length) {
      return res.status(404).json({ success: false, message: "Không có sản phẩm nào thuộc thương hiệu này!", products });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo thương hiệu:", error);
    res.status(500).json({ success: false, message: "Lỗi server!", log: error.message });
  }
};


// lấy dữ liệu theo id
async function getProById(id) {
    try {
        const product = await productModel.findById(id);

        return product;

    } catch (error) {
        console.log(error);
        throw new Error('Lỗi lấy dữ liệu');
    }
}
// Thêm dữ liệu 

async function addproduct(data) {
    try {
      const { ten, gia, gia_km, hinh, thumbnails, mota, soluongtonkho, thuonghieu_id, tinh_chat, hot, an_hien, trangthai } = data;
  
      console.log("📌 Data nhận được trong controller:", data);
  
      // Kiểm tra các trường bắt buộc
      if (
        !ten?.trim() || 
        gia === undefined || 
        gia_km === undefined || 
        !mota?.trim() || 
        soluongtonkho === undefined || 
        !thuonghieu_id || 
        an_hien === undefined || 
        trangthai === undefined || 
        tinh_chat === undefined
      ) {
        throw new Error("Thiếu thông tin sản phẩm!");
      }
  
      // Kiểm tra ID thương hiệu hợp lệ
      if (!mongoose.Types.ObjectId.isValid(thuonghieu_id)) {
        throw new Error("ID thương hiệu không hợp lệ!");
      }
  
      // Tìm thương hiệu trong database
      const thuonghieuFind = await categoryModel.findById(thuonghieu_id);
      if (!thuonghieuFind) {
        throw new Error(`Không tìm thấy thương hiệu với ID: ${thuonghieu_id}`);
      }
  
      // Định dạng thumbnails
      let formattedThumbnails = [];
      if (typeof thumbnails === "string") {
        formattedThumbnails = thumbnails.split(",").map(item => item.trim());
      } else if (Array.isArray(thumbnails)) {
        formattedThumbnails = thumbnails.filter(item => typeof item === "string" && item.trim() !== "");
      }
  
      // Tạo sản phẩm mới
      const newProduct = new productModel({
        ten: ten.trim(),
        gia,
        gia_km,
        hinh,
        thumbnails: formattedThumbnails,
        mota: mota.trim(),
        soluongtonkho,
        thuonghieu: {
          thuonghieu_id: thuonghieuFind._id,
          thuonghieuName: thuonghieuFind.ten,
          thuonghieuNation: thuonghieuFind.quocgia
        },
        tinh_chat: Number(tinh_chat) ,
        trangthai: Number(trangthai) ,
        hot: hot === true || hot === "true",
        an_hien: an_hien === true || an_hien === "true",
      });
  
      console.log("✅ Dữ liệu sản phẩm trước khi lưu:", newProduct);
  
      // Lưu vào database
      const savedProduct = await newProduct.save();
      console.log("✅ Sản phẩm đã lưu thành công:", savedProduct);
  
      return savedProduct;
    } catch (error) {
      console.error("🔥 Lỗi khi thêm sản phẩm:", error);
      throw new Error(error.message);
    }
  }
  

// cập nhật dữ liệu
async function updateproduct(data, id) {
    try {
      const { ten, gia, gia_km, hinh, thumbnails, mota, soluongtonkho, thuonghieu_id, tinhchat, hot, trangthai, an_hien } = data;
  
      // Kiểm tra ID có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`ID sản phẩm không hợp lệ: ${id}`);
      }
  
      // Kiểm tra sản phẩm có tồn tại không
      const productFind = await productModel.findById(id);
      if (!productFind) {
        throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
      }
  
      // Kiểm tra thông tin đầu vào (sửa lỗi `trangthai`, `an_hien` bị nhận nhầm là `false`)
      if (!ten || !gia || !gia_km || !mota || !soluongtonkho || !thuonghieu_id || trangthai === undefined || an_hien === undefined) {
        throw new Error("Thiếu thông tin sản phẩm!");
      }
  
      // Kiểm tra hình ảnh
      const newHinh = hinh || productFind.hinh;
      let formattedThumbnails = productFind.thumbnails;
  
      if (thumbnails !== undefined) {
        if (typeof thumbnails === "string") {
          formattedThumbnails = thumbnails.split(",").map(item => item.trim());
        } else if (Array.isArray(thumbnails)) {
          formattedThumbnails = thumbnails.filter(item => typeof item === "string" && item.trim() !== "");
        }
      }
  
      // Kiểm tra thương hiệu
      const thuonghieuFind = await categoryModel.findById(thuonghieu_id);
      if (!thuonghieuFind) {
        throw new Error(`Không tìm thấy thương hiệu với ID: ${thuonghieu_id}`);
      }
  
      console.log("📌 Dữ liệu trước khi cập nhật:", productFind); // Debug
  
      // Cập nhật sản phẩm
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          ten,
          gia,
          gia_km,
          hinh: newHinh,
          thumbnails: formattedThumbnails,
          mota,
          soluongtonkho,
          thuonghieu: {
            thuonghieu_id: thuonghieuFind._id,
            thuonghieuName: thuonghieuFind.ten,
            thuonghieuNation: thuonghieuFind.quocgia
          },
          tinhchat,
          hot,
          trangthai,
          an_hien
        },
        { new: true }
      );
  
      return updatedProduct;
    } catch (error) {
      console.error("🔥 Lỗi khi cập nhật sản phẩm:", error);
      throw new Error(error.message);
    }
  }
  
async function deleteProduct(id) {
    try {
        // Tìm kiếm sản phẩm
        const productFind = await productModel.findById(id);
        if (!productFind) {
            throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
        }
        // Xóa sản phẩm
        await productModel.findByIdAndDelete(id);
        return { message: "Sản phẩm đã được xóa thành công" };
    } catch (error) {
        console.error("🔥 Lỗi khi xóa sản phẩm:", error)
        throw new Error(error.message);
    }


}
async function getRelatedProducts(productId) {
    try {
        // Kiểm tra productId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("ID sản phẩm không hợp lệ");
        }

        // Tìm sản phẩm hiện tại
        const currentProduct = await productModel.findById(productId);
        if (!currentProduct) {
            throw new Error("Sản phẩm không tồn tại");
        }

        // Lấy sản phẩm có cùng thương hiệu (thuonghieu.thuonghieu_id)
        const relatedProducts = await productModel.find({
            "thuonghieu.thuonghieu_id": currentProduct.thuonghieu.thuonghieu_id,
            _id: { $ne: productId } // Loại trừ sản phẩm hiện tại
        }).limit(5);

        return relatedProducts;
    } catch (error) {
        console.error("🔥 Lỗi lấy sản phẩm liên quan:", error)
        throw new Error(error.message);
    }
}
async function getProductsPaginated(page = 1, limit = 10) {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const result = await productModel.paginate({}, { page, limit });

        return {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalProducts: result.totalDocs,
            products: result.docs
        };
    } catch (error) {
        throw new Error("Lỗi lấy danh sách sản phẩm: " + error.message);
    }
}








