
// http:localhost:3000/product/
async function showAllProducts() {
    const response = await fetch("http://localhost:3000/product", { mode: "cors" });

    const data = await response.json();
    console.log(data);
    let kq = '';
    let stt = 1;
    data.products.map(item =>{
        kq += `
            <tr>
                <td>${stt++}</td>
                <td>${item.ten}</td>
                <td>${item.gia_km}</td>

                <td><img src="http://localhost:3000/images/${item.hinh}" alt="${item.name}" width="100"></td>
                <td><a href="#" onclick="editPro(event, '${item._id}')">Sửa</a> | <a href="#" onclick="deletePro(event, '${item._id}')">Xóa</a></td>

            </tr>
        `;
    })
    document.getElementById('listsp').innerHTML=kq;
}

//cate
async function showAllCates() {
    const response = await fetch("http://localhost:3000/category", { mode: "cors" });
    const data = await response.json();
    console.log(data);
    let kq='';
    data.result.map(item=>{
        kq+=`<option value='${item._id}'>${item.ten}</option>`
    })
    document.getElementById('thuong_hieu').innerHTML=kq;
    
    
}
async function showAllCate() {
    const response = await fetch("http://localhost:3000/category", { mode: "cors" });
    const data = await response.json();
    console.log(data);
    let kq='';
    data.result.map(item=>{
        kq+=` <tr>
                <td>${item._id}</td>
                <td>${item.ten}</td>
                <td>${item.quocgia}</td>
                 <td><a href="#" onclick="editcate(event, '${item._id}')">Sửa</a> | <a href="#" onclick="deleteCate(event, '${item._id}')">Xóa</a></td>
            </tr>`
    })
    document.getElementById('thuong_hieushow').innerHTML=kq;
    
    
}


//add pro
async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('ten').value.trim();
    const oldprice = document.getElementById('gia').value;
    const newprice = document.getElementById('gia_km').value;
    const img = document.getElementById('hinh').files[0];
    const stock = document.getElementById('soluongtonkho').value;
    const hot = document.getElementById('hot').checked ? "true" : "false";
    const hide_show = document.getElementById('an_hien').checked ? "true" : "false";
    const thumbnails = document.getElementById('thumbnails').files;
    const description = document.getElementById('mota').value.trim();
    const thuonghieu = document.getElementById('thuong_hieu').value;
    const tinhchatValue = document.getElementById("tinh_chat").value;
    const trangthaiValue = document.getElementById("trangthai").value;

  
    if (!name) return alert("⚠️ Vui lòng nhập tên sản phẩm!");
    if (!oldprice || isNaN(oldprice)) return alert("⚠️ Giá gốc không hợp lệ!");
    if (!newprice || isNaN(newprice)) return alert("⚠️ Giá khuyến mãi không hợp lệ!");
    if (!img) return alert("⚠️ Vui lòng chọn ảnh sản phẩm!");
    if (!stock || isNaN(stock)) return alert("⚠️ Số lượng tồn kho không hợp lệ!");
    if (!description) return alert("⚠️ Vui lòng nhập mô tả sản phẩm!");
    if (!thuonghieu) return alert("⚠️ Vui lòng chọn thương hiệu!");

    const data = new FormData();
    data.append('ten', name);
    data.append('gia', oldprice);
    data.append('gia_km', newprice);
    data.append('hinh', img);
    data.append('soluongtonkho', stock);
    data.append('hot', hot);
    data.append('an_hien', hide_show);

    for (let i = 0; i < thumbnails.length; i++) {
        data.append('thumbnails', thumbnails[i]);
    }

    data.append('mota', description);
    data.append('trangthai', trangthaiValue);
    data.append('tinh_chat', tinhchatValue);
    data.append('thuonghieu_id', thuonghieu);

    console.log("🔥 Dữ liệu gửi đi:", Object.fromEntries(data.entries()));

    try {
        const response = await fetch('http://localhost:3000/product/addpro', {
            method: 'POST',
            body: data
        });

        const responseText = await response.text();
        console.log("📩 Phản hồi từ server (raw text):", responseText);

        try {
            const result = JSON.parse(responseText);
            console.log("✅ JSON Parsed Response:", result);

            if (result.status) {
                alert("🎉 Thêm sản phẩm thành công!");
                window.location.href = 'webadmin.html';
            } else {
                alert("❌ Thêm sản phẩm thất bại: " + result.message);
            }
        } catch (jsonError) {
            console.error("⚠️ Lỗi parse JSON:", jsonError);
            alert("❌ Phản hồi từ server không đúng định dạng JSON!");
        }
    } catch (error) {
        console.error("🚨 Lỗi khi gửi yêu cầu:", error);
        alert("⚠️ Có lỗi xảy ra khi gửi dữ liệu!");
    }
}
//edit pro
function editPro(event, id) {
    event.preventDefault();
    window.location.href = `editpro.html?id=${id}`;
}



//update pro
function updateProduct(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    let formData = new FormData();

    formData.append("ten", document.getElementById("edit_ten").value);
    formData.append("gia", document.getElementById("edit_gia").value);
    formData.append("gia_km", document.getElementById("edit_gia_km").value);
    formData.append("soluongtonkho", document.getElementById("edit_soluongtonkho").value);
    formData.append("mota", document.getElementById("edit_mota").value);
    formData.append("trangthai", document.getElementById("edit_trangthai").value);
    formData.append("tinh_chat", document.getElementById("edit_tinh_chat").value);
    formData.append("hot", document.getElementById("edit_hot").checked);
    formData.append("an_hien", document.getElementById("edit_an_hien").checked);

    let thuonghieu_id = document.getElementById("edit_thuong_hieu").value;
    formData.append("thuonghieu_id", thuonghieu_id);

    let hinh = document.getElementById("edit_hinh").files[0];
    if (hinh) {
        formData.append("hinh", hinh);
    }

    console.log("Dữ liệu gửi lên API:", Object.fromEntries(formData.entries()));

    fetch(`http://localhost:3000/product/update/${id}`, {
        method: "PUT",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Sản phẩm đã được cập nhật!");
        location.reload();
    })
    .catch(error => console.error('Lỗi khi cập nhật sản phẩm:', error));
}


//delete pro
async function deletePro(event,id) {
    event.preventDefault(); // Ngăn chặn load lại trang

    // Hỏi xác nhận trước khi xóa
    const confirmDelete = confirm("⚠️ Bạn có chắc muốn xóa sản phẩm này không?");
    if (!confirmDelete) return;

    try {
        
        const response = await fetch(`http://localhost:3000/product/delete/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        // alert("❌ Thêm sản phẩm thành công: " + result);
        console.log("✅ Kết quả xóa:", result);

        if (result.status) {
            alert("🗑️ Xóa sản phẩm thành công!");
            window.location.reload(); 
        } else {
            alert("❌ Xóa sản phẩm thất bại: " + result.message);
        }
    } catch (error) {
        console.error("🚨 Lỗi khi xóa sản phẩm:", error);
        alert("⚠️ Có lỗi xảy ra khi xóa!");
    }
}
// add cate
async function addCate(event) {
    event.preventDefault();

    // Lấy giá trị từ input
    const ten = document.getElementById('ten').value.trim();
    const quocgia = document.getElementById('nation').value.trim();

    // Kiểm tra dữ liệu nhập vào
    if (!ten) return alert("⚠️ Vui lòng nhập tên danh mục!");
    if (!quocgia) return alert("⚠️ Vui lòng nhập quốc gia!");

    // Tạo object dữ liệu
    const data = {
        ten: ten,
        quocgia: quocgia
    };

    console.log("🔥 Dữ liệu gửi đi:", data);

    try {
        const response = await fetch('http://localhost:3000/category/addcate', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },  // Xác định kiểu dữ liệu JSON
            body: JSON.stringify(data)  // Chuyển object thành JSON string
        });

        const result = await response.json();
        console.log("✅ JSON Parsed Response:", result);

        if (result.status) {
            alert("🎉 Thêm danh mục thành công!");
            window.location.href = 'category.html';
        } else {
            alert("❌ Thêm danh mục thất bại: " + result.message);
        }
    } catch (error) {
        console.error("🚨 Lỗi khi gửi yêu cầu:", error);
        alert("⚠️ Có lỗi xảy ra khi gửi dữ liệu!");
    }
}
// delete cate
async function deleteCate(event, id) {
    event.preventDefault(); // Ngăn chặn load lại trang

    // Hỏi xác nhận trước khi xóa
    const confirmDelete = confirm("⚠️ Bạn có chắc muốn xóa danh mục này không?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:3000/category/deletecate/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        console.log("✅ Kết quả xóa:", result);

        if (result.status) {
            alert("🗑️ Xóa danh mục thành công!");
            window.location.reload(); // Tải lại trang sau khi xóa
        } else {
            alert("❌ Xóa danh mục thất bại: " + result.log);
        }
    } catch (error) {
        console.error("🚨 Lỗi khi xóa danh mục:", error);
        alert("⚠️ Có lỗi xảy ra khi xóa!");
    }
}
// edit cate
function editcate(event, id) {
    event.preventDefault();
    window.location.href = `editcate.html?id=${id}`;
}
// update cate
function updateCategory1(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    // Kiểm tra phần tử tồn tại trước khi truy cập giá trị
    let nameInput = document.getElementById("edit_ten");
    let quocgiaInput = document.getElementById("edit_quocgia");
    let categoryIdInput = document.getElementById("category_id");

    if (!nameInput || !quocgiaInput || !categoryIdInput) {
        console.error("Không tìm thấy phần tử cần thiết trong form.");
        return;
    }

    // Lấy dữ liệu từ form
    let formData = {
        ten: nameInput.value,
        quocgia: quocgiaInput.value,
        category_id: categoryIdInput.value
    };

    fetch(`http://localhost:3000/category/updatecate/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("Danh mục đã được cập nhật!");
        window.location.href="category.html";
    })
    .catch(error => console.error('Lỗi khi cập nhật danh mục:', error));
}

//user
async function showAlluser() {
    const response = await fetch("http://localhost:3000/user", { mode: "cors" });
    const data = await response.json();
    console.log(data);
    let stt=1;

    let kq = '';
    data.result.map(item => {
        kq += `<tr>
                <td>${stt++}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.role === 0 ? 'User' : 'Admin'}</td>
                <td>
                    <a href="#" onclick="showUserDetail('${item._id}')">Xem chi tiết</a> | 
                    <a href="#" onclick="hideUser(event, '${item._id}')">Ẩn</a>
                </td>
            </tr>`;
    });
    document.getElementById('usershow').innerHTML = kq;
}

//xem chi tiết user
async function showUserDetail(userId) {
    try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        const data = await response.json();

        if (!data.status) {
            alert("Không tìm thấy người dùng!");
            return;
        }
        const user = data.result;
        const detailHTML = `
            <h2>Thông tin người dùng</h2>
            <p><strong>ID:</strong> ${user._id}</p>
            <p><strong>Tên:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Mật khẩu:</strong> ${user.password}</p>
            <p><strong>Số điện thoại:</strong> ${user.phone}</p>            
            <p><strong>Địa chỉ:</strong> ${user.address}</p>            
            <p><strong>Vai trò:</strong> ${user.role === 0 ? 'User' : 'Admin'}</p>
            <button class="btn btn-primary w-100" onclick="closeUserDetail()">Đóng</button>
        `;

        document.getElementById("userDetailContent").innerHTML = detailHTML;
        document.getElementById("userDetailContainer").style.display = "flex";

    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
}

function closeUserDetail() {
    document.getElementById("userDetailContainer").style.display = "none";
}

