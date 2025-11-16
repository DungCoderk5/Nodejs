async function showProductHot() {
  const response = await fetch("http://localhost:3000/product", {
    mode: "cors",
  });

  const data = await response.json();
  console.log(data);
  let kq = "";
  const hotProducts = data.products.filter((obj) => obj.hot === true);

  if (hotProducts.length === 0) {
    kq = "<p>Không có sản phẩm HOT nào!</p>";
  } else {
    hotProducts.forEach((sp) => {
      kq += `
            <div class="swiper-slide">
                        <div class="icon-heart">
                            <a href="#"><i class="fa fa-heart"></i></a>

                        </div>
                        <div class="price-sale">
                            <p>${(
                              (100 * (sp.gia - sp.gia_km)) /
                              sp.gia
                            ).toFixed(0)} %</p>
                        </div>
                       <a href="product-detail.html?id=${
                         sp._id
                       }"> <img src="http://localhost:3000/images/${sp.hinh}"
                            alt=""></a>
                        <div class="content-hotsale">
                            <img src="https://file.hstatic.net/200000306687/file/imager_8176_d244203aa9cf4dfbb410e1377abdac72_compact.jpg"
                                alt="">
                            <p>Còn lại ${sp.soluongtonkho} sản phẩm</p>
                        </div>
                        <span class="project-sale"></span>
                        <p>${sp.ten}</p>
                        <span class="price-hot">${
                          sp.gia.toLocaleString("vi") + " VNĐ"
                        }</span>
                        <div class="info-hot">
                            <span>Freeship</span>
                            <span>new</span>
                            <div class="rate-staring">
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                        </div>
                    </div>
        `;
    });
  }
  document.querySelector(".swiper-wrapper").innerHTML = kq;
}

async function showProductSale() {
  const response = await fetch("http://localhost:3000/product", {
    mode: "cors",
  });

  const data = await response.json();
  console.log(data);
  let kq = "";

  data.products.map((obj) => {
    kq += `
             <div class="swiper-slider1"  >
                            <div class="icon-heart">
                                <a href="#"><i class="fa fa-heart"></i></a>
                                <a href="#" class="hidden show them123" data-id="${
                                  obj._id
                                }">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </a>

                                <a href="" class="hidden show"><i class="fa-solid fa-magnifying-glass"></i></a>
                            </div>
                            <a href="product-detail.html?id=${
                              obj._id
                            }"><img class="hinh11" src="http://localhost:3000/images/${
      obj.hinh
    }" alt=""></a>
                            <div class="content-hotsale">
                                <img src="https://file.hstatic.net/200000306687/file/imager_8176_d244203aa9cf4dfbb410e1377abdac72_compact.jpg" alt="">
                                <p>Còn lại ${obj.soluongtonkho} sản phẩm</p>
                            </div>
                            <p class="ten">${obj.ten}</p>
                            <span class="price-hot tiengoc">${
                              obj.gia_km.toLocaleString("vi") + " VNĐ"
                            }</span>
                            <span class="price-sale tiengiam"><del>${
                              obj.gia.toLocaleString("vi") + " VNĐ"
                            }</del></span>
                            <div class="info-hot">
                                <span>Freeship</span>
                                <span>new</span>
                                <div class="rate-staring">
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                </div>
                            </div>
                        </div>
        `;
  });
  document.querySelector(
    ".home-product-slider-wrap-body .slider-container"
  ).innerHTML = kq;
}
//product.html
// Cập nhật số trang và điều hướng
async function fetchProducts(page = 1, limit = 12) {
  try {
    const response = await fetch(
      `http://localhost:3000/product/phantrang?page=${page}&limit=${limit}`
    );
    const data = await response.json();

    if (data.status) {
      renderProducts(data.products);
      renderPagination(data.page, data.totalPages);
    } else {
      console.error("❌ Lỗi lấy sản phẩm:", data.message);
    }
  } catch (error) {
    console.error("❌ Lỗi server:", error);
  }
}

async function renderProducts(products) {
  const container = document.querySelector(".product-grid");
  container.innerHTML = "";

  products.forEach((obj) => {
    const productElement = document.createElement("div");
    // productElement.classList.add("product-item");
    productElement.innerHTML = `
             <div class="product-card" data-price="${obj.gia_km}" data-name="${
      obj.ten
    }" data-date="2024-09-10">
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
    container.appendChild(productElement);
  });
}

async function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("a");
  prevButton.href = "#";
  prevButton.id = "prevPage";
  prevButton.classList.add("pagination-button");
  prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) fetchProducts(currentPage - 1);
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("a");
    pageButton.href = "#";
    pageButton.textContent = i;
    pageButton.classList.add("pagination-button");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", (e) => {
      e.preventDefault();
      fetchProducts(i);
    });
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement("a");
  nextButton.href = "#";
  nextButton.id = "nextPage";
  nextButton.classList.add("pagination-button");
  nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) fetchProducts(currentPage + 1);
  });
  paginationContainer.appendChild(nextButton);
}
async function showNameCategory() {
  const response = await fetch("http://localhost:3000/category", {
    mode: "cors",
  });

  const data = await response.json();
  console.log(data);
  let kq = "";
  data.result.map((obj) => {
    kq += `
    <div class="shop-filter-item">
        <input type="checkbox" id="shop-filter-type1" data-group="type"
               data-field="product_type" data-text="${obj.ten}" value="(${obj.ten})"
              data-operator="OR">
        <label for="shop-filter-type1">${obj.ten}</label>
         </div>
        `;
  });
  document.querySelector(".filter-category").innerHTML = kq;
  
}
showNameCategory();