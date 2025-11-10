/**
 * Products Manager - يدير جلب وعرض المنتجات
 */

class ProductsManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
    }

    /**
     * تحميل المنتجات من ملف JSON
     */
    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed to load products');
            const data = await response.json();
            this.products = data.products;
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    /**
     * تحميل الفئات
     */
    async loadCategories() {
        try {
            const response = await fetch('data/categories.json');
            if (!response.ok) throw new Error('Failed to load categories');
            const data = await response.json();
            this.categories = data.categories;
            return this.categories;
        } catch (error) {
            console.error('Error loading categories:', error);
            return [];
        }
    }

    /**
     * فلترة المنتجات حسب الفئة
     */
    filterByCategory(category) {
        this.currentFilter = category;
        if (category === 'all') {
            return this.products;
        }
        return this.products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * البحث في المنتجات
     */
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * ترتيب المنتجات
     */
    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
            default:
                return sorted.sort((a, b) => b.id - a.id);
        }
    }

    /**
     * الحصول على منتجات مميزة
     */
    getFeaturedProducts(limit = 6) {
        return this.products
            .filter(product => product.featured)
            .slice(0, limit);
    }

    /**
     * الحصول على منتج واحد
     */
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    /**
     * عرض المنتجات في HTML
     */
    renderProducts(products, containerId = 'products-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-box-open" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p style="color: #999; font-size: 1.1rem;">No products found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    /**
     * إنشاء كارت منتج
     */
    createProductCard(product) {
        const oldPriceHTML = product.oldPrice 
            ? `<span class="old-price">${product.oldPrice.toFixed(2)} EGP</span>` 
            : '';

        const discountBadge = product.oldPrice 
            ? `<div class="discount-badge">-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</div>` 
            : '';

        const tagsHTML = product.tags.slice(0, 3).map(tag => 
            `<span class="unified-tag">
                <i class="fa-solid fa-check"></i>
                ${tag}
            </span>`
        ).join('');

        const featuresHTML = product.features.slice(0, 2).map(feature =>
            `<span class="unified-tag">
                <i class="fa-solid fa-star"></i>
                ${feature}
            </span>`
        ).join('');

        return `
            <div class="game-card" data-id="${product.id}" data-category="${product.category}">
                ${discountBadge}
                <div class="game-image">
                    <img src="${product.image}" 
                         alt="${product.name}"
                         onerror="this.src='images/placeholder.jpg'"
                         loading="lazy">
                    <div class="game-category">${product.category}</div>
                    ${product.inStock ? '' : '<div class="out-of-stock-badge">Out of Stock</div>'}
                </div>
                
                <div class="game-details">
                    <h3 class="game-title">${product.name}</h3>
                    
                    ${product.platform ? `<p class="product-platform"><i class="fa-solid fa-desktop"></i> ${product.platform}</p>` : ''}
                    
                    <div class="hardware-features">
                        ${tagsHTML}
                        ${featuresHTML}
                    </div>
                    
                    <div class="game-info">
                        <div class="price-container">
                            ${oldPriceHTML}
                            <span class="game-price">${product.price.toFixed(2)} EGP</span>
                        </div>
                        <a href="product.html?id=${product.id}" class="buy-btn ${!product.inStock ? 'disabled' : ''}">
                            <i class="fa-solid fa-cart-shopping"></i>
                            ${product.inStock ? 'View Details' : 'Out of Stock'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// إنشاء instance عام
const productsManager = new ProductsManager();

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsManager;
}