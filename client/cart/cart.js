//show cart
async function showallcart() {
  const response = await fetch("http://localhost:3000/cart", { mode: "cors" });

  const data = await response.json();
  console.log(data);
  let kq = "";
  const cartHeader = [
    document.querySelector(".main-cart-data-head p strong"),
    document.querySelector(".icon-badge1"),
  ];
  if (data.result.length === 0) {
    kq = `  <div class="main-cart-data-none ">
                        <div class="section-title-all">
                            <h2>Bạn chưa lựa chọn được sản phẩm nào.?</h2>
                            <p>Tìm kiếm ngay sản phẩm mà bạn mong muốn với bộ sưu tập rộng lớn của chúng tôi!</p>
                            <form action="/search">
                                <input type="hidden" name="type" value="product">
                                <input type="text" placeholder="Tìm kiếm sản phẩm ..." id="animated-placeholder1">
                                <button type="submit" title="Tìm kiếm" fdprocessedid="qt8rdh">
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
                                        viewBox="0 0 612.01 612.01" style="enable-background: new 0 0 512 512" xml:space="preserve">
                                        <path d="M606.209,578.714L448.198,423.228C489.576,378.272,515,318.817,515,253.393C514.98,113.439,399.704,0,257.493,0 
                                                C115.282,0,0.006,113.439,0.006,253.393s115.276,253.393,257.487,253.393c61.445,0,117.801-21.253,162.068-56.586 
                                                l158.624,156.099c7.729,7.614,20.277,7.614,28.006,0C613.938,598.686,613.938,586.328,606.209,578.714z M257.493,467.8 
                                                c-120.326,0-217.869-95.993-217.869-214.407S137.167,38.986,257.493,38.986c120.327,0,217.869,95.993,217.869,214.407 
                                                S377.82,467.8,257.493,467.8z" fill="#000000" data-original="#000000"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                        <span>
                            <img width="1666" height="1000" title="Tìm kiếm" class="w-100 ls-is-cached lazyloaded"
                                src="https://file.hstatic.net/200000584705/file/37578_dae02aa6e03e4230b958e97100__1___1__db746ec851754034b04b27f8690072c7.jpg"
                                data-src="https://file.hstatic.net/200000584705/file/37578_dae02aa6e03e4230b958e97100__1___1__db746ec851754034b04b27f8690072c7.jpg"
                                alt="Cart none">
                        </span>
                    </div>`;
    document.querySelector("#cart-container-none").innerHTML = kq;
  } else {
    const productCount = data.result.length; // Số lượng sản phẩm trong giỏ hàng
    cartHeader.forEach((element) => {
      if (element) {
        element.textContent = productCount.toString(); // Thay đổi số lượng sản phẩm
      }
    });

    data.result.map((obj) => {
      kq += `
             <div class="main-cart-data-full-item" data-id="${obj._id}">


                                <div class="main-cart-data-full-item-image">
                                    <a href="product.html">
                                        <img title="Chuck Taylor All Star Classic" src="http://localhost:3000/images/${
                                          obj.hinh
                                        }"
                                            alt="Chuck Taylor All Star Classic">
                                    </a>
                                </div>
                                <div class="main-cart-data-full-item-info">
                                    <h3 class="main-cart-data-full-item-info-title"><a
                                            href="Lỗi liquid: Exception has been thrown by the target of an invocation."
                                            title="Chuck Taylor All Star Classic">${
                                              obj.ten
                                            }</a>
                                    </h3>
                                    <div class="main-cart-data-full-item-info-price">
                                        <label>Giá: </label>

                                        <p id="priceT">${
                                          obj.gia_km.toLocaleString("vi") +
                                          "VNĐ"
                                        }</p>
                                        <del>(${
                                          obj.gia.toLocaleString("vi") + "VNĐ"
                                        })</del>
                                    </div>

                                    <div class="main-cart-data-full-item-info-variant">
                                        <label>Phiên bản: </label>
                                        <span>${obj.size}</span>
                                    </div>

                                    <div class="main-cart-data-full-item-info-quantity shop-quantity-wrap">
                                        <label>Số lượng</label>
                                        <div class="shop-quantity">
                                            <button type="button" data-type="shop-quantity-minus" title="Giảm"
                                                fdprocessedid="mv3nzj">-</button>
                                            <input type="number" name="quantity_102679983" value="${
                                              obj.soluong
                                            }"
                                                min="1" readonly="" fdprocessedid="146nxe" id="quantityInput"
                                                class="quantity-input">
                                            <button type="button" data-type="shop-quantity-plus" title="Tăng"
                                                fdprocessedid="lg1764d">+</button>
                                        </div>
                                    </div>


                                    <div class="main-cart-data-full-item-info-total hidden d-none" hidden="">

                                        <label>Thành tiền: </label>
                                        <span>1.309.000₫</span>

                                    </div>
                                    <div class="main-cart-data-full-item-info-remove">
                                        <a href="/cart/change?line=1&amp;quantity=0" title="Xóa sản phẩm">Xoá sản
                                            phẩm</a>
                                    </div>
                                </div>
                                <div class="main-cart-data-full-item-action">
                                    <a href="" title="Xóa sản phẩm" class="xoa" onclick="deleteCart(event, '${
                                      obj._id
                                    }')"><svg version="1.1"
                                            x="0px" y="0px" viewBox="0 0 325.284 325.284"
                                            style="enable-background:new 0 0 325.284 325.284;" xml:space="preserve">
                                            <g>
                                                <path
                                                    d="M289.782,63.456H35.502c-7.04,0-12.768,5.732-12.768,12.768s5.732,12.768,12.768,12.768h2.828l25.856,206.644 c0,16.348,13.3,29.648,29.648,29.648h137.62c16.348,0,29.648-13.3,29.616-29.192l25.888-207.1h2.824 c7.04,0,12.768-5.732,12.768-12.768S296.822,63.456,289.782,63.456z M253.738,295.64c0,12.288-9.996,22.284-22.284,22.284H93.834 c-12.288,0-22.284-9.996-22.316-22.74L45.742,88.996h233.796L253.738,295.64z M289.782,81.632H35.502 c-2.98,0-5.404-2.424-5.404-5.404c0-2.98,2.424-5.404,5.404-5.404h254.28c2.98,0,5.404,2.424,5.404,5.404 C295.186,79.208,292.762,81.632,289.782,81.632z">
                                                </path>
                                                <path
                                                    d="M91.67,110.828c5.976,0,10.836,4.512,10.848,10.312l15.568,162.288c0,5.556-4.864,10.068-10.836,10.068 c-2.4,0-4.716-0.772-6.688-2.232c-1.148-0.86-2.76-0.616-3.6,0.536c-0.848,1.14-0.608,2.756,0.536,3.6 c2.864,2.128,6.236,3.244,9.752,3.244c8.82,0,15.992-6.824,15.98-15.46l-15.568-162.288c0-8.392-7.172-15.22-15.992-15.22 c-1.424,0-2.576,1.152-2.576,2.58C89.094,109.676,90.246,110.828,91.67,110.828z">
                                                </path>
                                                <path
                                                    d="M95.254,259.668c0.072,0,0.14-0.004,0.216-0.012c1.42-0.112,2.476-1.352,2.356-2.776l-7.976-98.652 c-0.112-1.42-1.4-2.448-2.776-2.356c-1.42,0.112-2.476,1.352-2.36,2.772l7.98,98.652 C92.798,258.648,93.926,259.668,95.254,259.668z">
                                                </path>
                                                <path
                                                    d="M176.058,177.516c-1.424,0-2.576,1.152-2.576,2.576v103.336c0,5.556-4.864,10.068-10.84,10.068 c-2.4,0-4.72-0.772-6.692-2.232c-1.14-0.856-2.76-0.612-3.6,0.54c-0.848,1.14-0.608,2.752,0.54,3.6 c2.864,2.124,6.24,3.24,9.752,3.24c8.82,0,15.992-6.824,15.992-15.22V180.088C178.634,178.664,177.482,177.516,176.058,177.516z">
                                                </path>
                                                <path
                                                    d="M154.418,254.94c1.424,0,2.576-1.152,2.576-2.576V112.368c1.724-1.008,3.656-1.54,5.652-1.54 c5.976,0,10.836,4.512,10.836,10.064v25.44c0,1.428,1.152,2.576,2.58,2.576c1.424,0,2.576-1.148,2.576-2.576v-25.44 c0-8.392-7.172-15.22-15.992-15.22c-3.516,0-6.892,1.12-9.76,3.248c-0.656,0.48-1.044,1.252-1.044,2.068v141.376 C151.842,253.788,152.994,254.94,154.418,254.94z">
                                                </path>
                                                <path
                                                    d="M219.05,132.444c1.432,0.156,2.636-1.012,2.708-2.436l0.948-17.592c1.744-1.044,3.704-1.588,5.72-1.588 c5.972,0,10.836,4.512,10.844,9.908l-10.392,162.692c0,5.552-4.864,10.064-10.836,10.064c-1.428,0-2.58,1.152-2.58,2.58 c0,1.424,1.152,2.576,2.58,2.576c8.82,0,15.988-6.828,15.984-15.06l10.392-162.692c0-8.392-7.172-15.22-15.992-15.22 c-3.516,0-6.892,1.12-9.76,3.248c-0.616,0.456-1,1.168-1.04,1.932l-1.016,18.88C216.538,131.156,217.63,132.368,219.05,132.444z">
                                                </path>
                                                <path
                                                    d="M210.754,275.728c0.052,0.004,0.1,0.004,0.152,0.004c1.356,0,2.488-1.056,2.572-2.424l6.436-109.056 c0.084-1.42-0.996-2.64-2.42-2.724c-1.36-0.092-2.636,1-2.72,2.42l-6.44,109.056 C208.246,274.428,209.334,275.648,210.754,275.728z">
                                                </path>
                                                <path
                                                    d="M43.614,56.54c2.032,0,3.684-1.648,3.684-3.684c0-12.288,9.996-22.288,22.284-22.288H255.71 c12.288,0,22.284,9.996,22.284,22.288c0,2.032,1.648,3.684,3.684,3.684c2.036,0,3.684-1.648,3.684-3.684 c0-16.348-13.3-29.648-29.648-29.648h-61.692C194.018,10.408,183.61,0,170.81,0h-16.336c-12.796,0-23.208,10.408-23.212,23.208 H69.578c-16.348,0-29.648,13.3-29.648,29.648C39.93,54.892,41.578,56.54,43.614,56.54z M154.474,7.364h16.336 c8.736,0,15.844,7.108,15.848,15.844h-48.032C138.63,14.472,145.738,7.364,154.474,7.364z">
                                                </path>
                                                <path
                                                    d="M258.734,41.384c-1.284-0.608-2.824-0.064-3.432,1.224c-0.608,1.284-0.06,2.82,1.224,3.432 c3.032,1.44,5.016,3.536,6.068,6.4c0.384,1.044,1.372,1.688,2.42,1.688c0.296,0,0.596-0.052,0.888-0.156 c1.34-0.492,2.024-1.972,1.532-3.308C265.91,46.528,262.982,43.404,258.734,41.384z">
                                                </path>
                                                <path
                                                    d="M220.206,38.056c-3.748,0.056-7.324,0.112-10.616,0.112c-1.424,0-2.576,1.152-2.576,2.58 c0,1.424,1.152,2.576,2.576,2.576c3.312,0,6.92-0.056,10.692-0.112c8.472-0.124,18.056-0.264,27.016,0.18 c0.044,0.004,0.092,0.004,0.132,0.004c1.364,0,2.504-1.072,2.572-2.444c0.08-1.42-1.02-2.632-2.44-2.704 C238.422,37.784,228.746,37.932,220.206,38.056z">
                                                </path>
                                            </g>
                                        </svg></a>
                                </div>
                            </div>
        `;
    });
    document.querySelector("#cart-container").innerHTML = kq;
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
    const cartItems = document.querySelectorAll(
      ".main-cart-data-full-item-info"
    );
    let total = 0;

    cartItems.forEach((item) => {
      const price =
        parseFloat(
          item.querySelector("#priceT").textContent.replace(/[^\d]/g, "")
        ) || 0;
      const quantity = parseInt(item.querySelector("input").value) || 1;
      total += price * quantity;
    });

    document.querySelector("#totalPrice").textContent =
      total.toLocaleString("vi-VN") + " VNĐ";
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