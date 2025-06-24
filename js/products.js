// Gestión de productos mejorada

class ProductManager {
    constructor() {
        this.filteredProducts = [...products];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
        // Comentamos la inicialización del lazy loading para usar carga directa
        // this.initializeImageLazyLoading();
    }

    bindEvents() {
        // Filtros de categorías
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Búsqueda con debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const debouncedSearch = Performance.debounce((term) => {
                this.setSearchTerm(term);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });

            // Limpiar búsqueda con Escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.target.value = '';
                    this.setSearchTerm('');
                }
            });
        }
    }

    setFilter(filter) {
        if (filter === this.currentFilter) return;

        this.currentFilter = filter;
        this.updateFilterButtons();
        this.filterProducts();
        
        // Tracking de analytics
        Analytics.trackEvent('Productos', 'Filtrar', filter);
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase().trim();
        this.filterProducts();
        
        // Tracking de búsqueda si hay término
        if (this.searchTerm) {
            Analytics.trackEvent('Productos', 'Buscar', this.searchTerm);
        }
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    filterProducts() {
        this.filteredProducts = products.filter(product => {
            const matchesCategory = this.currentFilter === 'all' || product.category === this.currentFilter;
            const matchesSearch = !this.searchTerm || 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm);
            
            return matchesCategory && matchesSearch;
        });

        this.renderProducts();
        this.updateResultsInfo();
    }

    updateResultsInfo() {
        const totalProducts = this.filteredProducts.length;
        const productGrid = document.getElementById('productGrid');
        
        if (totalProducts === 0 && (this.searchTerm || this.currentFilter !== 'all')) {
            this.showNoResultsMessage();
        }
    }

    showNoResultsMessage() {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>No se encontraron productos</h3>
                <p>
                    ${this.searchTerm ? 
                        `No hay productos que coincidan con "${this.searchTerm}"` : 
                        `No hay productos en la categoría "${CATEGORIES[this.currentFilter]}"`
                    }
                </p>
                <button class="btn" onclick="productManager.clearFilters()" style="margin-top: 1rem;">
                    Ver todos los productos
                </button>
            </div>
        `;
    }

    clearFilters() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.updateFilterButtons();
        this.filterProducts();
    }

    loadProducts() {
        this.filterProducts();
    }

    renderProducts() {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        // Mostrar loading si es necesario
        if (this.filteredProducts.length > 0) {
            productGrid.innerHTML = '<div class="loading-grid">Cargando productos...</div>';
        }

        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            productGrid.innerHTML = '';
            
            this.filteredProducts.forEach((product, index) => {
                const productCard = this.createProductCard(product, index);
                productGrid.appendChild(productCard);
            });

            // Ya no necesitamos inicializar lazy loading porque cargamos directamente
            // this.initializeImageLazyLoading();
        });
    }

    createProductCard(product, index) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        const isOutOfStock = !product.inStock;
        const stockClass = isOutOfStock ? 'out-of-stock' : '';
        const stockOverlay = isOutOfStock ? '<div class="stock-overlay">Agotado</div>' : '';
        
        productCard.innerHTML = `
            <div class="product-image ${stockClass}">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     data-category="${product.category}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                     style="width: 100%; height: 100%; object-fit: cover;">
                <div class="placeholder" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; background: #f0f0f0; font-size: 3rem; color: #ccc;">
                    ${CATEGORY_EMOJIS[product.category] || '📦'}
                </div>
                ${stockOverlay}
                ${this.createProductBadges(product)}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${this.createRatingDisplay(product)}
                <div class="product-price">${Format.currency(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-small ${isOutOfStock ? 'btn-disabled' : ''}" 
                            onclick="productManager.addToCart(${product.id})"
                            ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> 
                        ${isOutOfStock ? 'Agotado' : 'Agregar'}
                    </button>
                    <button class="btn btn-small btn-secondary" 
                            onclick="productManager.editProduct(${product.id})"
                            title="Editar producto">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>
        `;
        
        return productCard;
    }

    createProductBadges(product) {
        let badges = '';
        
        if (!product.inStock) {
            badges += '<div class="product-badge out-of-stock-badge">Agotado</div>';
        }
        
        if (product.rating >= 4.8) {
            badges += '<div class="product-badge popular-badge">Popular</div>';
        }
        
        return badges;
    }

    createRatingDisplay(product) {
        if (!product.rating || !product.reviews) return '';
        
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Estrellas llenas
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Media estrella
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Estrellas vacías
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return `
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-text">
                    ${product.rating} (${product.reviews} reseñas)
                </span>
            </div>
        `;
    }

    addToCart(productId) {
        const success = cart.addItem(productId);
        
        if (success) {
            // Animación visual en el botón
            const btn = event.target.closest('button');
            if (btn && !btn.disabled) {
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                btn.style.background = '#28a745';
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar';
                    btn.style.background = '';
                }, 1500);
            }
        }
    }

    editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            Notifications.error('Producto no encontrado');
            return;
        }

        // Modal simple para edición
        const newPrice = prompt(`Nuevo precio para ${product.name}:`, product.price);
        
        if (newPrice === null) return; // Cancelado
        
        if (!Validation.isPositiveNumber(newPrice)) {
            Notifications.error('Por favor ingresa un precio válido');
            return;
        }

        const oldPrice = product.price;
        product.price = parseFloat(newPrice);
        
        // Actualizar productos en el carrito si existen
        cart.items.forEach(item => {
            if (item.id === productId) {
                item.price = product.price;
            }
        });
        
        cart.updateUI();
        cart.saveCart();
        this.renderProducts();
        
        Notifications.success(
            `Precio actualizado: ${product.name}<br>
             ${Format.currency(oldPrice)} → ${Format.currency(product.price)}`
        );
        
        // Tracking de analytics
        Analytics.trackEvent('Admin', 'Editar Precio', product.name, product.price);
    }

    initializeImageLazyLoading() {
        // Usar el utility para lazy loading
        ImageUtils.lazy('img[data-lazy]');
    }

    // Métodos para análisis y reportes
    getProductStats() {
        const totalProducts = products.length;
        const inStockProducts = products.filter(p => p.inStock).length;
        const outOfStockProducts = totalProducts - inStockProducts;
        
        const categoriesCount = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
        
        const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
        const averageRating = products.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProducts;
        
        return {
            totalProducts,
            inStockProducts,
            outOfStockProducts,
            categoriesCount,
            averagePrice,
            averageRating
        };
    }

    searchProducts(query) {
        this.setSearchTerm(query);
        
        // Resaltar término de búsqueda en la UI
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
            searchInput.focus();
        }
    }

    getTopRatedProducts(limit = 5) {
        return [...products]
            .filter(p => p.rating && p.reviews)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    getMostReviewedProducts(limit = 5) {
        return [...products]
            .filter(p => p.reviews)
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, limit);
    }
}

// Crear instancia global del gestor de productos
const productManager = new ProductManager();