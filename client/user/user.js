// info user
async function getUserInfo() {
  // Lấy id từ URL
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  if (!userId) {
    alert("Không tìm thấy thông tin tài khoản!");
    window.location.href = "dangnhap.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    const data = await response.json();

    if (data.status) {
      // Hiển thị thông tin người dùng
      document.querySelector(
        ".acc-sidebar span"
      ).innerHTML = `<img width="64" height="64" src="https://ui-avatars.com/api/?name=${data.result.name}&amp;font-size=.5" alt="${data.result.name}" title="${data.result.name}">`;
      document.querySelector(
        ".acc-sidebar h3"
      ).insertAdjacentElement = `Xin chào, <b>${data.result.name}</b>`;
      document.querySelector(
        '.acc-data[data-show="1"] p:nth-of-type(1)'
      ).innerHTML = `<strong>Họ tên:</strong> ${data.result.name}`;
      document.querySelector(
        '.acc-data[data-show="1"] p:nth-of-type(2)'
      ).innerHTML = `<strong>Email:</strong> ${data.result.email}`;
      document.querySelector(
        '.acc-data[data-show="1"] p:nth-of-type(3)'
      ).innerHTML = `<strong>Số điện thoại:</strong> +84${data.result.phone}`;
      document.querySelector(
        '.acc-data[data-show="1"] p:nth-of-type(4)'
      ).innerHTML = `<strong>Địa chỉ:</strong> ${data.result.address}`;

      const accDataRole = document.querySelector(
        '.acc-data[data-show="1"] p:nth-of-type(5)'
      );

      if (accDataRole) {
        if (data.result.role === 1) {
          accDataRole.innerHTML = `<strong>Tới website của bạn:</strong> <a href="/admin/adminthuancss.html">Nhấp vào đây</a>`;
        } else {
          accDataRole.style.display = "none";
        }
      }
    } else {
      alert("Lỗi khi lấy thông tin tài khoản!");
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin tài khoản:", error);
    alert("Đã xảy ra lỗi, vui lòng thử lại!");
  }
}