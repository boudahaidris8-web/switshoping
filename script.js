// 1. تهيئة المكتبة (تأكد من وضع مفتاحك الخاص)
emailjs.init("KZG6Ukf-d1pLzdvmP"); 

const container = document.querySelector(".products-grid");
let currentOrder = {}; // متغير لحفظ بيانات المنتج قبل فتح النافذة

// 2. دالة عرض المنتجات (نفس الشكل السابق)
function renderProducts() {
    if (!container || typeof products === 'undefined') return;
    container.innerHTML = ""; 

    products.forEach((product, index) => {
        const div = document.createElement("div");
        div.classList.add("product-card");

        let sizeHTML = product.sizes ? `
            <select id="size-${index}" class="product-select">
                <option value="">المقاس</option>
                ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>` : '';

        let colorHTML = product.colors ? `
            <select id="color-${index}" class="product-select">
                <option value="">اللون</option>
                ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>` : '';

        div.innerHTML = `
            <div class="product-image"><img src="${product.image}" style="width:100%"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-options">${sizeHTML} ${colorHTML}</div>
                <div class="product-price">${product.price} دج</div>
                <button class="add-to-cart" onclick="openOrderModal(${index})">إتمام الطلب</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// 3. دالة فتح النافذة المنبثقة وحفظ خيارات المنتج
function openOrderModal(index) {
    const product = products[index];
    const selectedSize = document.getElementById(`size-${index}`)?.value || "غير محدد";
    const selectedColor = document.getElementById(`color-${index}`)?.value || "غير محدد";

    // حفظ البيانات مؤقتاً
    currentOrder = {
        product_name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor
    };

    // إظهار النافذة (Modal)
    document.getElementById("orderModal").style.display = "flex";
}

// 4. دالة الإرسال النهائي بعد ملء المعلومات الشخصية
function confirmFinalOrder() {
    const uName = document.getElementById("userName").value;
    const uPhone = document.getElementById("userPhone").value;
    const uAddress = document.getElementById("userAddress").value;

    if (!uName || !uPhone) {
        alert("يا إدريس، الزبون لازم يعمر الاسم والهاتف!");
        return;
    }

    // دمج معلومات المنتج مع معلومات الزبون
    const templateParams = {
        ...currentOrder,
        user_name: uName,
        user_phone: uPhone,
        user_address: uAddress
    };

    emailjs.send('service_e4eae7l', 'template_w3svytn', templateParams)
        .then(() => {
            alert("✅ الطلب وصلك للإيميل يا إدريس!");
            closeModal();
        }, (error) => {
            alert("❌ فشل الإرسال، تحقق من الإعدادات.");
            console.log(error);
        });
}

function closeModal() {
    document.getElementById("orderModal").style.display = "none";
}

renderProducts();