async function getAllVocher() {
    try {
        let res = await fetch('http://localhost:3000/voucher');
        let data = await res.json();

        let kq = '';
        data.result.forEach(voucher => {
            kq += `
            <div class="home-coupon-item">
                <img src="https://file.hstatic.net/200000306687/file/background-coupon_d5a81f5bc7ea49_ec6d59fdd17c4a718809792590ed9455.png">
                <div class="home-coupon-content">
                    <div class="home-coupon-content-head">
                        <h3>Mã : ${voucher.code}</h3>
                        <img decoding="async"
                            src="//bizweb.dktcdn.net/100/493/370/themes/940719/assets/home_coupon_item_image_2.png?1713464283843"
                            title="Mã : ${voucher.code}" alt="Mã : ${voucher.code}">
                        <p>Mã giảm ${voucher.giam_gia}% khi mua ${voucher.so_luong_sp} sản phẩm</p>
                    </div>
                    <div class="home-coupon-content-foot">
                        <button data-type="coupon-policy" data-coupon="${voucher.code}">
                            Điều kiện áp dụng
                            <span class="home-coupon-content-info">
                                - ${voucher.mo_ta || "Không có mô tả"} 
                            </span>
                        </button>

                        <button data-type="coupon-copy" data-coupon="${voucher.code}">
                            <span>Sao chép mã</span>
                        </button>
                    </div>
                </div>
            </div>
            `;
        });

        // Render toàn bộ 1 lần
        document.querySelector(".home-coupon").innerHTML = kq;

        // Sau khi render mới gán event
        addCopyEvents();

    } catch (error) {
        console.error("Error fetching vouchers:", error);
    }
}


function addCopyEvents() {
    let ngu = document.querySelectorAll('[data-type="coupon-copy"]');

    ngu.forEach(item => {
        item.addEventListener('click', function handler() {

            let text = item.getAttribute('data-coupon');
            navigator.clipboard.writeText(text);

            item.textContent = 'Đã sao chép';

            setTimeout(() => {
                item.textContent = 'Sao chép mã';
                item.classList.add('hieung');
            }, 2000);

            item.removeEventListener('click', handler);
        });
    });
}

// Gọi hàm
getAllVocher();
