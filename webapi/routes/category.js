// http://localhost:3000/category
var express = require('express');
var router = express.Router();
const categoryController = require('../mongo/controller/category.controller');
// http://localhost:3000/category

router.get('/', async (req, res) => {
  try {
    const result = await categoryController.getAllcate();
    return res.status(200).json({ status: true, result })
  }
  catch (error) {
    console.log(console.error);
    return res.status(500).json({ status: false, message: "Lỗi lấy dữ liệu" })
  }
  // res.send('respond with a resource');
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryController.getCateById(id);
// 
    if (!category) {
      return res.status(404).send("Danh mục không tồn tại");
    }

    // res.render('product_detail', { product }); 
    return res.status(200).json({ status: true, category });

  } catch (error) {
    console.error(error);
    res.status(500).send({message:"Lỗi ??",log: error.message});
  }
});
router.post('/addcate', async (req, res) => {
  try {
    const result = await categoryController.addCategory(req.body);
    return res.status(200).json({ status: true, result })
  }
  catch (error) {
    console.log(console.error);
    return res.status(500).json({ status: false, message: "Lỗi thêm dữ liệu",log: error.message })

  }
});

router.put('/updatecate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryController.updateaCate( req.body,id);
    return res.status(200).json({ status: true, result })
  }
  catch (error) {
    console.log(console.error);
    return res.status(500).json({ status: false, message: "Lỗi cập nhật dữ liệu" , log: error.message,})
  }

});
//delete category
router.delete('/deletecate/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const result = await categoryController.deleteCate(id);
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
