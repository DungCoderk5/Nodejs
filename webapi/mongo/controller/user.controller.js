// thực hiện thao tác CRUD với collection users
const { use } = require('../../routes/category');
const userModel = require('../model/user.model')
const bcryptjs = require('bcryptjs')
const nodemailer= require('nodemailer');
const crypto = require("crypto");

// Cấu hình Nodemailer để gửi email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "luuducdungdcm@gmail.com",
      pass: "bhuq jkhw miss onav" 
  }
});
module.exports = { getAlluser, deleteUser, addUser, updateUser, resign, login,getUserById,forgotPassword,resetPassword ,doi_mat_kau}
// lấy toàn bộ dữ liệu
async function getAlluser() {
  try {
    const result = await userModel.find()
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
//lấy dữ liệu theo id
async function getUserById(id) {
  try {
    const result = await userModel.findById(id)
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
async function forgotPassword(req, res) {
   try {
        const { email } = req.body;
  
        // Kiểm tra email có tồn tại trong database không
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: false, message: "Email không tồn tại!" });
        }
  
        // Tạo mã token reset mật khẩu
        const resetToken = crypto.randomBytes(20).toString("hex");
  
        // Lưu token vào database với thời hạn sử dụng
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút
        await user.save();
  
        // **Chỉnh sửa đường link gửi đến email**
        const resetLink = `http://127.0.0.1:5501/project/client/reset-password.html?token=${resetToken}`;
  
        // Cấu hình email gửi đi
        const mailOptions = {
            from: '"Hỗ trợ khách hàng" <luuducdungdcm@gmail.com>', // Email gửi
            to: email,
            subject: "Yêu cầu đặt lại mật khẩu",
            html: `
                <p>Xin chào,</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                <p>Vui lòng click vào đường link bên dưới để đặt lại mật khẩu:</p>
                <p><a href="${resetLink}" style="color: blue; text-decoration: underline;">Đặt lại mật khẩu</a></p>
                <p>Link này sẽ hết hạn sau 15 phút.</p>
                <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,</p>
                <p>Hỗ trợ khách hàng</p>
            `
        };
  
        // Gửi email
        await transporter.sendMail(mailOptions);
  
        return res.json({ status: true, message: "Email đặt lại mật khẩu đã được gửi!" });
  
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Lỗi server!" });
    }
}
async function resetPassword(req, res) {
  try {
      const { token, newPassword } = req.body;

      // Kiểm tra xem token có tồn tại không
      const user = await userModel.findOne({ 
          resetPasswordToken: token, 
          resetPasswordExpires: { $gt: Date.now() } // Token còn hạn sử dụng
      });

      if (!user) {
          return res.status(400).json({ status: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
      }

      // **Băm mật khẩu mới trước khi lưu**
      const hashedPassword = await bcryptjs.hash(newPassword, 10); // Salt rounds = 10

      // Cập nhật mật khẩu và xóa token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return res.json({ status: true, message: "Mật khẩu đã được đặt lại thành công!" });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Lỗi server!" });
  }
};
// đổi mật khẩu
async function doi_mat_kau (req, res)  {
  try {
    const { userId, oldpass, newpass } = req.body;

    // Kiểm tra đầu vào
    if (!userId || !oldpass || !newpass) {
        return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
    }

    // Tìm người dùng theo ID
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcryptjs.compare(oldpass, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newpass, salt);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
} catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ message: "Lỗi server", error });
}

};
  

//thêm dữ liệu
async function addUser(data) {
  try {
    const { name, email, password, role } = data;

    // Kiểm tra dữ liệu đầu vào
    if (![name, email, password].every(val => typeof val === 'string' && val.trim()) || !role) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await userModel.findOne({ email: email.trim() });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    // Tạo người dùng mới
    const newUser = new userModel({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role,
    });

    return await newUser.save();
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
// đăng ký user mới
async function resign(data) {
  try {
    const { name, email, password,phone,address, role = 0 } = data;

    if (role === undefined) {
      throw new Error("Role is required");
    }

    const existingUser = await userModel.findOne({ email: email.trim() });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password.trim(), salt);

    const newUser = new userModel({ name, email, password: hash,phone,address, role });
    const result = await newUser.save();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
// login
async function login(data) {
  const { email, password } = data;
  let user = await userModel.findOne({ email: email });
  if (!user) {
    throw new Error("email chưa được đăng kí");
  }
  let checkpass = bcryptjs.compareSync(password, user.password)
  if (!checkpass) {
    throw new Error("Mật khẩu không đúng");
  }
  //user._doc.password
  delete user._doc.password
  user = { ...user._doc }
  return user;
}
//sửa dữ liệu
async function updateUser(id, data) {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const { name, email, password, role } = data;
    // Kiểm tra dữ liệu đầu vào
    if (![name, email, password].every(val => typeof val === 'string' && val.trim()) || !role) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await userModel.findOne({ email: email.trim() });
    if (existingUser && existingUser._id.toString() !== id) {
      throw new Error("Email đã tồn tại");
    }
    // Cập nhật người dùng
    const updateUser = await userModel.findByIdAndUpdate(id, {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role,
    }, { new: true });

    return await updateUser.save();
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
// xóa dữ liệu
async function deleteUser(id) {
  try {
    const result = await userModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }

}



