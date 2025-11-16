var express = require('express');
var router = express.Router();
const userController = require('../mongo/controller/user.controller');

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);


/* GET users listing. */
router.get('/', async (req, res) => {

  try {
    const result = await userController.getAlluser();
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
    const id = req.params.id;
    const result = await userController.getUserById(id);
    return res.status(200).json({ status: true, result })
  }
  catch (error) {
    console.log(console.error);
    return res.status(500).json({
      status: false, message: "Lỗi lấy dữ liệu",log: error.message,
    });
  }
});

//thêm người dùng
router.post('/resign', async (req, res) => {
  try {
    let { name, email, password,phone,address, role= 0 } = req.body;

    // Đảm bảo role là số
    role = Number(role);
    if (isNaN(role)) {
      return res.status(400).json({ status: false, message: "Role must be a number" });
    }

    const result = await userController.resign({ name, email, password,phone,address, role });
    return res.status(200).json({ status: true, message: "Thêm thành công", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Lỗi thêm dữ liệu",
      log: error.message
    });
  }
});
//đăng nhập
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    const result = await userController.login({ email, password });
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Lỗi đăng nhập",
      log: error.message
    });
  }
});
// sửa người dùng
router.put('/updateuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await userController.updateUser(id, data);
    return res.status(200).json({ status: true, message: "Sửa thành công", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Lỗi sửa dữ liệu",
      log: error.message
    });
  }
});
//doi mat khau
router.post("/doi-mat-khau",userController.doi_mat_kau); 
// xóa người dùng
router.delete('/deleteuser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userController.deleteUser(id);
    return res.status(200).json({ status: true, message: "Xóa thành công ", result });
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
