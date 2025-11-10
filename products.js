const STORAGE_KEY = 'angryStoreProducts_v2';

// دالة تحميل المنتجات
function loadProducts() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allProducts = stored ? JSON.parse(stored) : [];
        
        // تحديد الصفحة الحالية
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // فلترة المنتجات حسب الصفحة
        return allProducts.filter(p => p.page === currentPage);
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        return [];
    }
}

// دالة عرض المنتجات
function displayProducts() {
    const container = document.getElementById('products-container');
    const products = loadProducts();
    
    if (!container) {
        console.error('لا يوجد عنصر بـ ID: products-container');
        return;
    }

    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">⚠️ لا توجد منتجات متاحة حالياً</p>';
        return;
    }

    products.forEach(product => {
        // تحديد حالة التوفر
        const isAvailable = product.available !== false;
        const availabilityClass = isAvailable ? '' : 'out-of-stock';
        const availabilityBadge = isAvailable 
            ? '' 
            : '<div class="unavailable-overlay"><span>❌ نفذت الكمية</span></div>';

        // عرض أول 3 تاجز فقط
        const tagsHtml = (product.tags || []).slice(0, 3).map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        const productCard = `
            <div class="product-card ${availabilityClass}">
                ${availabilityBadge}
                <img src="${product.image}" alt="${product.name}" onerror="this.src='img/placeholder.jpg'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <div class="tags-wrapper">${tagsHtml}</div>
                    <p class="price">${product.price} جنيه</p>
                    ${isAvailable 
                        ? `<button class="buy-btn" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                             🛒 أضف للسلة
                           </button>`
                        : `<button class="unavailable-btn" disabled>
                             🚫 غير متوفر حالياً
                           </button>`
                    }
                </div>
            </div>
        `;
        
        container.innerHTML += productCard;
    });
}

// دالة إضافة للسلة (مثال بسيط)
function addToCart(name, price, image) {
    // يمكنك تطوير دالة السلة هنا
    alert(`✅ تم إضافة "${name}" للسلة!
💰 السعر: ${price} جنيه`);
    
    // مثال: حفظ في localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ name, price, image, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', displayProducts);