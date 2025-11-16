
//show cate nav
async function showCateNav() {
  const response = await fetch("http://localhost:3000/category", {
    mode: "cors",
  });
  const data = await response.json();
  console.log(data);

  let kq = "";
  data.result.forEach((item) => {
    kq += ` <li><a href="spthuonghieu.html?brand_id=${item._id}">${item.ten}</a></li>`;
  });

  document.querySelector(".subnav").innerHTML = kq;
}
async function getProductsByBrand(brandId) {
  try {
    const response = await fetch(
      `http://localhost:3000/product/products-by-brand/${brandId}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    const container = document.querySelector(".product-grid");
    container.innerHTML = ""; // Xóa sản phẩm cũ trước khi cập nhật

    data.products.forEach((obj) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-card");

      productElement.innerHTML = `
                <div class="product-image">
                    <a href="product-detail.html?id=${obj._id}">
                        <img src="http://localhost:3000/images/${
                          obj.hinh
                        }" alt="${obj.ten}" loading="lazy">
                    </a>
                    <span class="discount">${(
                      (100 * (obj.gia - obj.gia_km)) /
                      obj.gia
                    ).toFixed(0)}%</span>
                </div>
                <h3>${obj.ten}</h3>
                <div class="price">
                    <span class="new-price">${obj.gia_km.toLocaleString(
                      "vi"
                    )} VNĐ</span>
                    <span class="old-price">${obj.gia.toLocaleString(
                      "vi"
                    )} VNĐ</span>
                </div>
            `;

      container.appendChild(productElement);
    });
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
}
showCateNav();
// dangnhap.html
async function dang_nhap(email, password) {
  try {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }
    localStorage.setItem("user", JSON.stringify(data.result));
    console.log("Đăng nhập thành công:", data);
    return data.result; // Trả về thông tin user
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.message);
    return null;
  }
}
//dangky.html
async function dang_ky(name, email, password, phone, address) {
  try {
    const response = await fetch("http://localhost:3000/user/resign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, address }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Đăng ký thất bại");
    }
    console.log("Đăng ký thành công:", data);
    return data.result; // Trả về thông tin user
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.message);
    return null;
  }
}
//kiểm tra dang899 nhập
function kiem_tra_dang_nhap() {
  const user = localStorage.getItem("user");

  if (user) {
    const userInfo = JSON.parse(user);

    // Thay đổi href của biểu tượng user
    const userIcon = document.querySelector(".fa-user").parentElement;
    if (userIcon) {
      userIcon.href = `account.html?id=${userInfo._id}`;
      userIcon.removeAttribute("onclick"); 
    }

    return userInfo;
  } else {
    return null;
  }
}
// Gọi hàm kiểm tra trên tất cả các trang
kiem_tra_dang_nhap();
// đăng xuất
async function dang_xuat() {
  localStorage.removeItem("user"); // Xóa thông tin đăng nhập
  alert("Bạn đã đăng xuất!");
  window.location.href = "dangnhap.html"; // Chuyển hướng về trang đăng nhập
}
//show cart menu
async function showallcartmenu() {
  const response = await fetch("http://localhost:3000/cart", { mode: "cors" });
  const data = await response.json();
  console.log(data);
  let kq = "";
  const cartHeader = document.querySelector(".icon-badge1");
  if (data.result.length === 0) {
    kq = `<div class="shop-cart-sidebar-no">Giỏ hàng của bạn còn trống</div>`;
    document.querySelector(".showanmenu").innerHTML = kq;
  } else {
    const productCount = data.result.length;
    const cartHeader = document.querySelector(".icon-badge1");
    if (cartHeader) {
      cartHeader.textContent = productCount.toString(); // Thay đổi số lượng sản phẩm
    }

    data.result.map((obj) => {
      kq += `
            <div class="shop-cart-sidebar-yes">
                <div class="shop-cart-item" data-id="${obj._id}">
                    <div class="shop-cart-item-left">
                        <a href="cart.html">
                            <img title="Chuck Taylor All Star Classic"
                                src="http://localhost:3000/images/${obj.hinh}"
                                alt="${obj.ten}">
                        </a>
                    </div>
                    <div class="shop-cart-item-right">
                        <h4><a href="/cart.html" title="Chuck Taylor All Star Classic">${
                          obj.ten
                        }</a></h4>
                        <span>${obj.size}</span>
                        <p>${obj.gia_km.toLocaleString("vi") + " VNĐ"}</p>
                        <div class="shop-cart-item-right-action">

                            <div class="shop-cart-item-right-action-quantity shop-quantity-wrap">
                                <label>Số lượng</label>
                                <div class="shop-quantity">
                                    <button type="button" data-type="shop-quantity-minus" title="Giảm"
                                        fdprocessedid="mv3nzj">-</button>
                                    <input type="number" name="quantity_102679983" value="${
                                      obj.soluong
                                    }" min="1" readonly=""
                                        fdprocessedid="146nxe">
                                    <button type="button" data-type="shop-quantity-plus" title="Tăng"
                                        fdprocessedid="lg1764d">+</button>
                                </div>

                            </div>

                            <div class="shop-cart-item-right-action-remove">
                                <button type="button" title="Xóa" onclick="deleteCart(event, '${
                                  obj._id
                                }')" data-type="shop-cart-item-remove"
                                    data-href="/cart/change?line=1&amp;quantity=0" data-id="102679983"
                                    fdprocessedid="noq3lj">Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector(".showmenu").innerHTML = kq;
  }

  document
    .querySelectorAll('[data-type="shop-quantity-plus"]')
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        const input = e.target.closest(".shop-quantity").querySelector("input");
        let quantity = parseInt(input.value) || 1;
        input.value = quantity + 1;
        updateCartTotal(); // Hàm cập nhật tổng giá
      });
    });
  function updateCartTotal() {
    const cartItems = document.querySelectorAll(".shop-cart-item");
    let total = 0;

    cartItems.forEach((item) => {
      const price =
        parseFloat(item.querySelector("p").textContent.replace(/[^\d]/g, "")) ||
        0;
      const quantity = parseInt(item.querySelector("input").value) || 1;
      total += price * quantity;
    });

    document.querySelector(".toCheckout span:last-child").textContent =
      total.toLocaleString("vi-VN") + "₫";
  }

  document
    .querySelectorAll('[data-type="shop-quantity-minus"]')
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        const input = e.target.closest(".shop-quantity").querySelector("input");
        let quantity = parseInt(input.value) || 1;
        if (quantity > 1) {
          input.value = quantity - 1;
          updateCartTotal(); // Hàm cập nhật tổng giá
        }
      });
    });
  updateCartTotal();
}
//xóa giỏ hàng
async function deleteCart(event, id) {
  event.preventDefault(); // Ngăn chặn load lại trang

  // Hỏi xác nhận trước khi xóa
  const confirmDelete = confirm("⚠️ Bạn có chắc muốn xóa sản phẩm này không?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:3000/cart/deletecart/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    // alert("❌ Thêm sản phẩm thành công: " + result);
    console.log("✅ Kết quả xóa:", result);

    if (result.status) {
      alert("🗑️ Xóa sản phẩm khỏi giỏ hàng thành công!");
      window.location.reload();
    } else {
      alert("❌ Xóa sản phẩm thất bại: " + result.message);
    }
  } catch (error) {
    console.error("🚨 Lỗi khi xóa sản phẩm:", error);
    alert("⚠️ Có lỗi xảy ra khi xóa!");
  }
}
async function showRelatedProducts(productId) {
  try {
    const response = await fetch(
      `http://localhost:3000/product/related-products/${productId}`
    );
    const data = await response.json();

    if (data.status) {
      const relatedProducts = data.products;
      renderRelatedProducts(relatedProducts);
    } else {
      console.error("❌ Lỗi khi lấy sản phẩm liên quan:", data.message);
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối API sản phẩm liên quan:", error);
  }
}
showallcartmenu();
//tìm kiếm
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("animated-placeholder");
  const productContainer = document.querySelector(".product-grid");

  async function fetchProducts(searchKeyword) {
    try {
      const response = await fetch(
        `http://localhost:3000/product/search?search=${searchKeyword}`
      );
      const data = await response.json();

      if (data.status && data.products.length > 0) {
        displayProducts(data.products);
      } else {
        productContainer.innerHTML = `<p>❌ Không tìm thấy sản phẩm</p>`;
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối API:", error);
      productContainer.innerHTML = `<p>⚠️ Lỗi tải dữ liệu</p>`;
    }
  }

  function displayProducts(products) {
    productContainer.innerHTML = ""; // Xóa danh sách cũ

    products.forEach((obj) => {
      const productHTML = `
                <div class="product-card" data-id="${obj._id}" data-price="${
        obj.gia_km
      }" data-name="${obj.ten}" data-date="2024-09-10">
            <div class="product-image">
                <a href="product-detail.html?id=${
                  obj._id
                }"><img src="http://localhost:3000/images/${obj.hinh}"
                    alt="${obj.ten}"></a>
                <span class="discount">${
                  ((100 * (obj.gia - obj.gia_km)) / obj.gia).toFixed(0) + " %"
                }</span>
                <button class="wishlist-btn">❤️</button>
            </div>
            <h3>${obj.ten}</h3>
            <div class="price">
                <span class="new-price">${
                  obj.gia_km.toLocaleString("vi") + " VNĐ"
                }</span>
                <span class="old-price">${
                  obj.gia.toLocaleString("vi") + " VNĐ"
                }</span>
            </div>
            <div class="tags">
                <span class="new">new</span>
                <span class="freeship">freeship</span>
            </div>
        </div>
            `;
      productContainer.innerHTML += productHTML;
    });
  }

  // Lắng nghe sự kiện nhập vào input tìm kiếm
  searchInput.addEventListener("keyup", () => {
    const searchValue = searchInput.value.trim();
    if (searchValue.length > 2) {
      // Chỉ tìm khi nhập từ 3 ký tự trở lên
      fetchProducts(searchValue);
    } else {
      productContainer.innerHTML = ""; // Xóa kết quả khi không nhập gì
    }
  });
});
