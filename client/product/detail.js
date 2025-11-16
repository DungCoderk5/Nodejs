//product-detail.html
async function renderDetail() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const response = await fetch(`http://localhost:3000/product/${productId}`);

    if (!response.ok) {
      throw new Error(`Lỗi server: ${response.status}`);
    }

    const product = await response.json();

    if (!product || Object.keys(product).length === 0) {
      document.getElementById("product-detail").innerHTML =
        "<p>Sản phẩm không tồn tại.</p>";
      return;
    }

    // Tạo nội dung HTML hiển thị sản phẩm
    let productHTML = `
            <div class="main-product-wrap">
                <div class="main-product-left main-product-feature">
                    <div class="zoom-container">
                        <img src="http://localhost:3000/images/${
                          product.product.hinh
                        }" alt="${product.product.ten}" 
                            class="main-product-image" id="mainImage">
                    </div>
                    <div class="main-product-thumbnails">
                        <img src="http://localhost:3000/images/${
                          product.product.hinh
                        }" 
                            alt="Thumbnail 1" class="thumbnail" 
                            onclick="changeImage('http://localhost:3000/images/${
                              product.product.hinh
                            }')">
                        ${product.product.thumbnails
                          .map(
                            (thumb, index) => `
                            <img src="http://localhost:3000/images/${thumb}" 
                                alt="Thumbnail ${index + 2}" class="thumbnail" 
                                onclick="changeImage('http://localhost:3000/images/${thumb}')">
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="main-product-right">
        <div class="main-product-share">
            <button type="button" data-type="main-product-share-overplay"
                class="main-product-share-overplay"></button>
            <button type="button" data-type="main-product-share-open-popup" class="main-product-share-cta"
                title="Chia sẻ" fdprocessedid="lwdq7o">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path fill="#595959"
                        d="M19 3c-1.652 0-3 1.348-3 3 0 .46.113.895.3 1.285L12.587 11h-4.77A2.999 2.999 0 005 9c-1.652 0-3 1.348-3 3s1.348 3 3 3c1.3 0 2.402-.84 2.816-2h4.77l3.715 3.715c-.188.39-.301.824-.301 1.285 0 1.652 1.348 3 3 3s3-1.348 3-3-1.348-3-3-3c-.46 0-.895.113-1.285.3l-3.3-3.3 3.3-3.3c.39.187.824.3 1.285.3 1.652 0 3-1.348 3-3s-1.348-3-3-3z">
                    </path>
                </svg>
            </button>
            <div class="main-product-share-popup">
                <div class="main-product-share-popup-head">
                    <label>Chia sẻ</label>
                    <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ Facebook"
                        href="https://www.facebook.com/sharer.php?u=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                            width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27 0H5a5 5 0 00-5 5v22a5 5 0 005 5h22a5 5 0 005-5V5a5 5 0 00-5-5z"
                                fill="#1778F2"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M20.314 32V19.499h3.255L24 15.19h-3.686l.006-2.156c0-1.123.1-1.725 1.623-1.725h2.034V7h-3.255c-3.91 0-5.285 2.09-5.285 5.604v2.587H13v4.308h2.437V32h4.877z"
                                fill="#fff"></path>
                        </svg></a>
                    <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ Twitter"
                        href="https://twitter.com/intent/tweet?url=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                            width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="4" fill="#1FA1F3"></rect>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M15.73 13.235l.04.634-.674-.077c-2.455-.298-4.6-1.308-6.42-3.004l-.89-.841-.23.621c-.485 1.385-.175 2.848.836 3.832.54.544.419.622-.512.298-.324-.104-.607-.181-.634-.143-.094.091.23 1.27.486 1.735.35.648 1.065 1.282 1.847 1.657l.661.298-.782.013c-.755 0-.782.013-.701.285.27.841 1.335 1.735 2.522 2.123l.836.272-.728.414a7.894 7.894 0 01-3.615.958c-.607.013-1.106.065-1.106.104 0 .13 1.646.854 2.603 1.14 2.873.84 6.285.478 8.848-.959 1.82-1.023 3.642-3.055 4.491-5.023.459-1.049.918-2.965.918-3.884 0-.596.04-.673.795-1.385.445-.415.864-.868.945-.997.134-.246.12-.246-.567-.026-1.146.388-1.308.337-.742-.246.418-.414.917-1.165.917-1.385 0-.04-.202.026-.431.142-.243.13-.783.324-1.187.44l-.729.22-.66-.427c-.364-.233-.877-.492-1.147-.57-.688-.18-1.74-.155-2.36.052-1.686.583-2.752 2.085-2.63 3.729z"
                                fill="#fff"></path>
                        </svg></a>
                    <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ WhatsApp"
                        href="https://wa.me/?text=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                            viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                            clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
                            <path
                                d="M116.225-.001c-11.264.512-26.112 1.536-32.768 3.072-10.24 2.048-19.968 5.12-27.648 9.216-9.728 4.608-17.92 10.752-25.088 17.92-7.68 7.68-13.824 15.872-18.432 25.6-4.096 7.68-7.168 17.408-9.216 27.648-1.536 6.656-2.56 21.504-2.56 32.768-.512 4.608-.512 10.752-.512 13.824v265.729c.512 11.264 1.536 26.112 3.072 32.768 2.048 10.24 5.12 19.968 9.216 27.648 4.608 9.728 10.752 17.92 17.92 25.088 7.68 7.68 15.872 13.824 25.6 18.432 7.68 4.096 17.408 7.168 27.648 9.216 6.656 1.536 21.504 2.56 32.768 2.56 4.608.512 10.752.512 13.824.512h265.728c11.264-.512 26.112-1.536 32.768-3.072 10.24-2.048 19.968-5.12 27.648-9.216 9.728-4.608 17.92-10.752 25.088-17.92 7.68-7.68 13.824-15.872 18.432-25.6 4.096-7.68 7.168-17.408 9.216-27.648 1.536-6.656 2.56-21.504 2.56-32.768.512-4.608.512-10.752.512-13.824V116.223c-.512-11.264-1.536-26.112-3.072-32.768-2.048-10.24-5.12-19.968-9.216-27.648-4.608-9.728-10.752-17.92-17.92-25.088-7.68-7.68-15.872-13.824-25.6-18.432-7.68-4.096-17.408-7.168-27.648-9.216-6.656-1.536-21.504-2.56-32.768-2.56-4.608-.512-10.752-.512-13.824-.512H116.225z"
                                fill="url(#whatsApp_svg___Linear1)" fill-rule="nonzero"></path>
                            <path
                                d="M344.754 289.698c-4.56-2.282-26.98-13.311-31.161-14.832-4.18-1.521-7.219-2.282-10.259 2.282-3.041 4.564-11.78 14.832-14.44 17.875-2.66 3.042-5.32 3.423-9.88 1.14-4.561-2.281-19.254-7.095-36.672-22.627-13.556-12.087-22.709-27.017-25.369-31.581s-.283-7.031 2-9.304c2.051-2.041 4.56-5.324 6.84-7.986 2.28-2.662 3.04-4.564 4.56-7.606 1.52-3.042.76-5.705-.38-7.987-1.14-2.282-10.26-24.72-14.06-33.848-3.701-8.889-7.461-7.686-10.26-7.826-2.657-.132-5.7-.16-8.74-.16-3.041 0-7.98 1.141-12.161 5.704-4.18 4.564-15.96 15.594-15.96 38.032 0 22.438 16.34 44.116 18.62 47.159 2.281 3.043 32.157 49.089 77.902 68.836 10.88 4.697 19.374 7.501 25.997 9.603 10.924 3.469 20.866 2.98 28.723 1.806 8.761-1.309 26.98-11.029 30.781-21.677 3.799-10.649 3.799-19.777 2.659-21.678-1.139-1.902-4.179-3.043-8.74-5.325m-83.207 113.573h-.061c-27.22-.011-53.917-7.32-77.207-21.137l-5.539-3.287-57.413 15.056 15.325-55.959-3.608-5.736c-15.184-24.145-23.203-52.051-23.192-80.704.033-83.611 68.083-151.635 151.756-151.635 40.517.016 78.603 15.811 107.243 44.474 28.64 28.663 44.404 66.764 44.389 107.283-.035 83.617-68.083 151.645-151.693 151.645m129.102-280.709c-34.457-34.486-80.281-53.487-129.103-53.507-100.595 0-182.468 81.841-182.508 182.437-.013 32.156 8.39 63.546 24.361 91.212l-25.892 94.545 96.75-25.37c26.657 14.535 56.67 22.194 87.216 22.207h.075c100.586 0 182.465-81.852 182.506-182.448.019-48.751-18.946-94.59-53.405-129.076"
                                fill="#fff"></path>
                            <defs>
                                <linearGradient gradientTransform="matrix(0 -512 -512 0 256.001 512)"
                                    gradientUnits="userSpaceOnUse" id="whatsApp_svg___Linear1" x1="0" x2="1"
                                    y1="0" y2="0">
                                    <stop offset="0" stop-color="#25cf43"></stop>
                                    <stop offset="1" stop-color="#61fd7d"></stop>
                                </linearGradient>
                            </defs>
                        </svg></a>
                    <a target="_blank" aria-label="Chia sẻ Facebook" title="Chia sẻ Linkedin"
                        href="https://www.linkedin.com/sharing/share-offsite/?url=https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"><svg
                            width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="4" fill="#0077B5"></rect>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M10.857 9.07c-.022-1.094-.744-1.927-1.917-1.927S7 7.976 7 9.07C7 10.142 7.744 11 8.895 11h.022c1.196 0 1.94-.858 1.94-1.93zm0 3.216H7v11.571h3.857V12.286zm9.294 0c2.771 0 4.849 1.616 4.849 5.089v6.482h-4.212V17.81c0-1.52-.609-2.556-2.134-2.556-1.163 0-1.856.698-2.16 1.373-.112.242-.14.58-.14.917v6.314h-4.211s.055-10.244 0-11.305h4.212v1.601c.559-.77 1.56-1.867 3.796-1.867z"
                                fill="#fff"></path>
                        </svg></a>
                </div>
                <hr>
                <div class="main-product-share-popup-body">
                    <label>Sao chép đường dẫn</label>
                    <form>
                        <input
                            value="https://f1genz-shoes.mysapo.net/converse-chuck-taylor-all-star-specialty-suede"
                            readonly="" id="main-product-share-copy">
                        <button type="button" title="Sao chép" data-type="main-product-share-copy">Sao
                            chép</button>
                    </form>
                </div>
            </div>
        </div>
        <h1 class="main-product-title ">${product.product.ten}</h1>
        <div class="main-product-info">
            <div class="main-product-info-sku">
                <strong>Mã sản phẩm: </strong>
                <span>Đang cập nhật</span>
            </div>
            <div class="main-product-info-barcode">
                <strong>Barcode: </strong>
                <span>Đang cập nhật</span>
            </div>
            <div class="main-product-info-vendor">
                <strong>Thương hiệu: </strong>
                <span>Converse</span>
            </div>
            <div class="main-product-info-type">
                <strong>Dòng sản phẩm: </strong>
                <span>Giày cổ cao</span>
            </div>
        </div>
        <div class="main-product-price">
            <div class="main-product-price-wrap">
                <del class="main-product-price-compare">${
                  product.product.gia.toLocaleString("vi") + " VNĐ"
                }</del>

                <span class="main-product-price-this">${
                  product.product.gia_km.toLocaleString("vi") + " VNĐ"
                }</span>

                <span class="main-product-price-discount">Tiết kiệm ${(
                  (100 * (product.product.gia - product.product.gia_km)) /
                  product.product.gia
                ).toFixed(0)}%</span>
            </div>
            <div class="sapo-product-reviews-badge" data-id="33445614">
                <div class="sapo-product-reviews-star" data-score="0" data-number="5" style="color: #ffbe00"
                    title="Not rated yet!"><i data-alt="1" class="star-off-png fa-regular fa-star"
                        title="Not rated yet!"></i>&nbsp;<i data-alt="2"
                        class="star-off-png fa-regular fa-star" title="Not rated yet!"></i>&nbsp;<i
                        data-alt="3" class="star-off-png fa-regular fa-star"
                        title="Not rated yet!"></i>&nbsp;<i data-alt="4"
                        class="star-off-png fa-regular fa-star" title="Not rated yet!"></i>&nbsp;<i
                        data-alt="5" class="star-off-png fa-regular fa-star"
                        title="Not rated yet!"></i><input name="score" type="hidden" readonly=""></div>
            </div>
        </div>
        <!-- Flash Sale -->
        <div class="productFSale">
            <img src="https://file.hstatic.net/200000306687/file/ezgif.com-gif-maker_40e5c36d115b4904babbebc78c90c34e.gif"
                alt="productFSale">
            <div data-time="1/4/2025 24:00:00" class="countdownLoop">
                <span id="days"><b>70 </b></span><span> Ngày</span>
                <span id="hours"><b>07</b></span><span> Giờ</span>
                <span id="minutes"><b>41</b> </span><span> Phút</span>
                <span id="seconds"><b>53</b></span> <span> Giây</span>
            </div>
        </div>
        <!-- End Flash Sale -->
        <div class="d-none">
            <div class="selector-wrapper"><select class="single-option-selector" data-option="option1"
                    id="main-product-select-option-0">
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                </select></div><select id="main-product-select" name="id" style="display: none;">
                <option value="102679924">35</option>
                <option value="102679925">36</option>
                <option value="102679926">37</option>
                <option value="102679927">38</option>
            </select>
        </div>
        <div class="main-product-swatch">




            <div class="product-sw-line">
                <div class="product-sw-select">
                    <div class="product-sw-title">Size</div>
                    <span class="product-sw-select-item">
<input type="radio" data-value="35" name="product-choose-size" data-name="option1"
value="35" class="trigger-option-sw" id="product-choose-size-2">
<label for="product-choose-size-2" class="product-sw-select-item-span">35</label>
</span>
<span class="product-sw-select-item">
<input type="radio" data-value="36" name="product-choose-size" data-name="option1"
value="36" class="trigger-option-sw" id="product-choose-size-3">
<label for="product-choose-size-3" class="product-sw-select-item-span">36</label>
</span>
<span class="product-sw-select-item">
<input type="radio" data-value="37" name="product-choose-size" data-name="option1"
value="37" class="trigger-option-sw" id="product-choose-size-4">
<label for="product-choose-size-4" class="product-sw-select-item-span">37</label>
</span>
<span class="product-sw-select-item">
<input type="radio" data-value="38" name="product-choose-size" data-name="option1"
value="38" class="trigger-option-sw" id="product-choose-size-5">
<label for="product-choose-size-5" class="product-sw-select-item-span">38</label>
</span>


                </div>
            </div>

        </div>
        <div class="main-product-quantity shop-quantity-wrap">
            <label>Số lượng</label>
            <div class="shop-quantity">
                <button type="button" data-type="shop-quantity-minus" title="Giảm"
                    fdprocessedid="s4ysna">-</button>
                <input type="number" name="quantity"id="soluong" value="1" min="1" readonly="" fdprocessedid="rnzroa">
                <button type="button" data-type="shop-quantity-plus" title="Tăng"
                    fdprocessedid="mvmsg9">+</button>
            </div>
        </div>
        <div class="main-product-freeship">
            <div class="shop-freeship" data-freeship-price="50000000">
                <div class="shop-freeship-bar">
                    <div class="shop-freeship-bar-main"><span style="width: 0%;"></span></div>
                </div>
                <div class="shop-freeship-note">Mua thêm <span>50.000.000₫</span> để được miễn phí giao
                    hàng
                    trên toàn quốc</div>
            </div>
        </div>
        <div class="main-product-cta">
            <button type="button" data-type="main-product-add" title="Thêm vào giỏ" fdprocessedid="61fv2g">
                <strong>Thêm vào giỏ</strong>
                <span>Chọn ngay sản phẩm bạn yêu thích</span>
            </button>
            <button type="button" data-type="main-product-send-help" title="Tư vấn" fdprocessedid="6mh1p">
                <strong>Tư vấn</strong>
                <span>Tư vấn thiết kế nội thất tùy chọn</span>
            </button>
            <button type="button" data-type="main-product-send-info" onclick="window.open('/pages/lien-he')"
                title="Liên hệ" fdprocessedid="zhjj0m">
                <strong>Liên hệ</strong>
                <span>Chúng tôi luôn bên bạn 24/7</span>
            </button>
        </div>
    </div>
            </div>
        `;

    // Đưa nội dung vào `#product-detail`
    document.getElementById("product-detail").innerHTML = productHTML;
    document
      .querySelectorAll('[data-type="shop-quantity-plus"]')
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const input = e.target
            .closest(".shop-quantity")
            .querySelector("input");
          let quantity = parseInt(input.value) || 1;
          input.value = quantity + 1;
        });
      });

    document
      .querySelectorAll('[data-type="shop-quantity-minus"]')
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const input = e.target
            .closest(".shop-quantity")
            .querySelector("input");
          let quantity = parseInt(input.value) || 1;
          if (quantity > 1) {
            input.value = quantity - 1;
          }
        });
      });
    const price = product.product.price
      ? product.product.price.toLocaleString()
      : "N/A";
    console.log(price);
    const buttons = document.querySelectorAll('[data-type="main-product-add"]');

    buttons.forEach((btn) => {
      btn.addEventListener("click", addToCart); // Không có dấu ()
    });
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
    document.getElementById("product-detail").innerHTML =
      "<p>Lỗi tải dữ liệu sản phẩm.</p>";
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
async function renderRelatedProducts(products) {
  const relatedContainer = document.querySelector(".product-relate");
  if (!relatedContainer) return;

  relatedContainer.innerHTML = products
    .map(
      (obj) => `
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
        `
    )
    .join("");
}
//addprotocart
async function addToCart() {
  const url = new URL(window.location.href);
  const productID = url.searchParams.get("id");

  if (!productID) {
    alert("❌ Không tìm thấy sản phẩm!");
    return;
  }

  const imgElement = document.querySelector(".main-product-thumbnails img");
  const imageUrl = imgElement ? imgElement.src : "";
  const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  console.log("🖼 Tên hình ảnh:", fileName);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user._id) {
    alert("❌ Bạn chưa đăng nhập!");
    return;
  }

  const userID = user._id;
  console.log("👤 User ID:", userID);

  // Hàm chuyển giá từ "1.800.000 VNĐ" => 1800000 (Number)
  function parsePrice(priceText) {
    return Number(priceText.replace(/[^0-9]/g, "")) || 0;
  }

  const productData = {
    ten: document.querySelector(".main-product-title")?.textContent || "",
    gia: parsePrice(
      document.querySelector(".main-product-price-compare")?.textContent || "0"
    ),
    gia_km: parsePrice(
      document.querySelector(".main-product-price-this")?.textContent || "0"
    ),
    soluong:
      parseInt(
        document.querySelector('.shop-quantity input[name="quantity"]')?.value
      ) || 1,
    size:
      document.querySelector('input[name="product-choose-size"]:checked')
        ?.value || "",
    userID: userID,
    productID: productID,
    hinh: fileName,
  };

  try {
    const response = await fetch("http://localhost:3000/cart/addprotocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    console.log("✅ Thêm vào giỏ hàng thành công:", data);
    alert(data.message);
    window.location.href = "cart.html";
  } catch (error) {
    console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
    alert("Có lỗi xảy ra!");
  }
}