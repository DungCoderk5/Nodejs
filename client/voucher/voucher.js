// Function to handle attaching event listeners to the copy buttons
function attachVoucherCopyListeners() {
    // Select all buttons with the data-type="coupon-copy" attribute
    let copyButtons = document.querySelectorAll('[data-type="coupon-copy"]');
    
    copyButtons.forEach(function (item) {
        // Use a simple click listener
        item.addEventListener('click', function handler() {
            // Get the voucher code from the data-coupon attribute
            let textToCopy = item.getAttribute('data-coupon');

            // Copy the text to the clipboard
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Success feedback
                    item.innerHTML = '<span>Đã sao chép</span>';
                    
                    // Reset the button text after 2 seconds
                    setTimeout(() => {
                        item.innerHTML = '<span>Sao chép mã</span>';
                        // Note: I removed the .hieung class and cursor style logic as they weren't fully defined.
                        // You can add back item.classList.add('hieung') if needed for styling.
                    }, 2000);

                    // You might not want to remove the event listener permanently
                    // Removing it (item.removeEventListener) means the user can only click once,
                    // which is likely not the desired behavior. I have commented out the removeEventListener.
                    // item.removeEventListener('click', handler); 

                })
                .catch(err => {
                    console.error('Lỗi khi sao chép mã:', err);
                    item.innerHTML = '<span>Lỗi sao chép</span>';
                    setTimeout(() => {
                        item.innerHTML = '<span>Sao chép mã</span>';
                    }, 2000);
                });
        });
    });
}

// 1. IMPROVED ASYNC FUNCTION
async function getAllVocher() {
    try {
        let res = await fetch('http://localhost:3000/voucher');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        let data = await res.json();
        
        if (!data.result || !Array.isArray(data.result)) {
             throw new Error('Dữ liệu voucher không đúng định dạng hoặc trống');
        }
        
        let kq = '';
        
        // 2. Build the HTML string completely first (Efficient)
        data.result.forEach(voucher => {
            const voucherCode = voucher.code || 'UNKNOWN';
            
            // CRITICAL FIX: Ensure data-coupon attribute uses the dynamic voucher.code
            kq += `
            <div class="home-coupon-item">
                <img src="https://file.hstatic.net/200000306687/file/background-coupon_d5a81f5bc7ea49_ec6d59fdd17c4a718809792590ed9455.png" alt="">
                <div class="home-coupon-content">
                    <div class="home-coupon-content-head">
                        <h3>Mã : ${voucherCode}</h3>
                        <img decoding="async"
                            src="//bizweb.dktcdn.net/100/493/370/themes/940719/assets/home_coupon_item_image_2.png?1713464283843"
                            title="Mã : ${voucherCode}" alt="Mã : ${voucherCode}">
                        <p>Mã giảm 17% khi mua 2 sản phẩm</p>
                    </div>
                    <div class="home-coupon-content-foot">
                        <button data-type="coupon-policy" data-coupon="${voucherCode}" title="Điều kiện áp dụng" fdprocessedid="aaux8r">
                            Điều kiện áp dụng
                            <span class="home-coupon-content-info">- Mã giảm 10% khi mua 1 sản phẩm. - Mỗi khách hàng được sử dụng tối đa 1 lần. - Số lượng voucher có hạn</span>
                        </button>
                        <button data-type="coupon-copy" data-coupon="${voucherCode}" fdprocessedid="p5qb9s" class="">
                            <span>Sao chép mã</span>
                        </button>
                    </div>
                </div>
            </div>
            `;
            // REMOVED: document.querySelector(".home-coupon").innerHTML = kq;
        });
        
        // 3. Update the DOM only once
        const container = document.querySelector(".home-coupon");
        if (container) {
            container.innerHTML = kq;
            // 4. ATTACH LISTENERS AFTER RENDERING
            attachVoucherCopyListeners();
        } else {
             console.error('Không tìm thấy container ".home-coupon" để hiển thị voucher.');
        }


    } catch (error) {
        console.error('Error fetching vouchers:', error);
        // Optionally display an error message to the user
        const container = document.querySelector(".home-coupon");
        if (container) {
            container.innerHTML = '<p>Xin lỗi, không thể tải danh sách voucher. Vui lòng thử lại sau.</p>';
        }
    }
}

// Ensure the main function is called, perhaps after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', getAllVocher);
// async function getAllVocher() {
//    try {
//     let res = await fetch('http://localhost:3000/voucher');
//     let data = await res.json();
//     let kq ='';
//     data.result.forEach(voucher => {
//         kq += `
//         <div class="home-coupon-item">
//             <img src="https://file.hstatic.net/200000306687/file/background-coupon_d5a81f5bc7ea49_ec6d59fdd17c4a718809792590ed9455.png"
//                 alt="">
//             <div class="home-coupon-content">
//                 <div class="home-coupon-content-head">
//                     <h3>Mã : ${voucher.code}</h3>
//                     <img decoding="async"
//                         src="//bizweb.dktcdn.net/100/493/370/themes/940719/assets/home_coupon_item_image_2.png?1713464283843"
//                         title="Mã : ${voucher.code}" alt="Mã : ${voucher.code}">
//                     <p>Mã giảm 17% khi mua 2 sản phẩm</p>
//                 </div>
//                 <div class="home-coupon-content-foot">
//                     <button data-type="coupon-policy" data-coupon="F1SHOES" title="Điều kiện áp dụng"
//                         fdprocessedid="aaux8r">
//                         Điều kiện áp dụng
//                         <span class="home-coupon-content-info">- Mã giảm 10% khi mua 1 sản phẩm. - Mỗi khách hàng được
//                             sử dụng tối đa 1 lần. - Số lượng voucher có hạn</span>
//                     </button>
//                     <button data-type="coupon-copy" data-coupon="F1SHOES" fdprocessedid="p5qb9s" class="">
//                         <span>Sao chép mã</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//         `;
//          document.querySelector(".home-coupon").innerHTML = kq;
//     });        
//     } catch (error) {
//         console.error('Error fetching vouchers:', error);
//     }
    
// }
//  let ngu = document.querySelectorAll('[data-type="coupon-copy"]');
//     ngu.forEach(function (item) {
//         item.addEventListener('click', function handler() {
//             let text = item.getAttribute('data-coupon');
//             navigator.clipboard.writeText(text);
//             // alert('Đã sao chép mã giảm giá');
//             item.textContent = 'Đã sao chép';
//             setTimeout(() => {
//                 item.textContent = 'Sao chép mã';
//                 item.classList.add('hieung');
//                 // item.style.cursor = "none";
//             }, 2000);
//             item.removeEventListener('click', handler);
//         });
//     });
