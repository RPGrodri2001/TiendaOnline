// Gestor específico para la página de catálogo completo

class CatalogManager extends ProductManager {
    constructor() {
        super();
        this.sortOrder = 'name-asc';
        this.initCatalogFeatures();
    }

    initCatalogFeatures() {
        this.setupSorting();
        this.setupAdvancedSearch();
        this.updateProductCounts();
        this.setupUrlFilters();
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortOrder = e.target.value;
                this.sortAndRenderProducts();
            });
        }
    }

    setupAdvancedSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput) {
            // Mostrar/ocultar botón de limpiar búsqueda
            searchInput.addEventListener('input', (e) => {
                const hasValue = e.target.value.length > 0;
                if (clearSearch) {
                    clearSearch.style.display = hasValue ? 'block' : 'none';
                }
                this.updateSearchResults();
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                clearSearch.style.display = 'none';
                this.setSearchTerm('');
                this.updateSearchResults();
            });
        }
    }

    setupUrlFilters() {
        // Permitir filtrar desde URL (ej: catalogo.html?category=chocolates)
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const search = urlParams.get('search');

        if (category && CATEGORIES[category]) {
            this.setFilter(category);
        }

        if (search) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = search;
                this.setSearchTerm(search);
            }
        }
    }

    updateProductCounts() {
        // Actualizar contadores en los filtros
        const counts = {
            all: products.length,
            chocolates: products.filter(p => p.category === 'chocolates').length,
            flores: products.filter(p => p.category === 'flores').length,
            otros: products.filter(p => p.category === 'otros').length
        };

        Object.entries(counts).forEach(([category, count]) => {
            const element = document.getElementById(`count-${category}`);
            if (element) {
                element.textContent = `(${count})`;
            }
        });
    }

    updateSearchResults() {
        const resultsDiv = document.getElementById('searchResults');
        const resultCount = document.getElementById('resultCount');
        
        if (resultsDiv && resultCount) {
            const hasSearch = this.searchTerm.length > 0;
            const hasFilter = this.currentFilter !== 'all';
            
            if (hasSearch || hasFilter) {
                resultsDiv.style.display = 'block';
                resultCount.textContent = this.filteredProducts.length;
            } else {
                resultsDiv.style.display = 'none';
            }
        }
    }

    sortAndRenderProducts() {
        // Aplicar ordenamiento
        this.sortProducts();
        this.renderProducts();
    }

    sortProducts() {
        const [field, direction] = this.sortOrder.split('-');
        
        this.filteredProducts.sort((a, b) => {
            let valueA, valueB;
            
            switch (field) {
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'price':
                    valueA = a.price;
                    valueB = b.price;
                    break;
                case 'rating':
                    valueA = a.rating || 0;
                    valueB = b.rating || 0;
                    break;
                default:
                    return 0;
            }
            
            if (direction === 'asc') {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });
    }

    filterProducts() {
        super.filterProducts();
        this.sortProducts();
        this.updateSearchResults();
    }

    createProductCard(product, index) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card catalog-card';
        productCard.style.animationDelay = `${index * 0.05}s`; // Animación más rápida para muchos productos
        
        const isOutOfStock = !product.inStock;
        const stockClass = isOutOfStock ? 'out-of-stock' : '';
        const stockOverlay = isOutOfStock ? '<div class="stock-overlay">Agotado</div>' : '';
        
        // Destacar término de búsqueda
        const highlightedName = this.highlightSearchTerm(product.name);
        const highlightedDescription = this.highlightSearchTerm(product.description);
        
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
                <div class="product-category-badge">${CATEGORIES[product.category]}</div>
            </div>
            <div class="product-info">
                <h3>${highlightedName}</h3>
                <p>${highlightedDescription}</p>
                ${this.createRatingDisplay(product)}
                <div class="product-price">${Format.currency(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-small ${isOutOfStock ? 'btn-disabled' : ''}" 
                        onclick="cart.addItem(${product.id})"
                            ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> 
                        ${isOutOfStock ? 'Agotado' : 'Agregar'}
                    </button>
                    <button class="btn btn-small btn-secondary" 
                            onclick="catalogManager.viewProduct(${product.id})"
                            title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver
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
            badges += '<div class="product-badge popular-badge">Muy Popular</div>';
        } else if (product.rating >= 4.5) {
            badges += '<div class="product-badge recommended-badge">Recomendado</div>';
        }
        
        return badges;
    }

    createRatingDisplay(product) {
        if (!product.rating || !product.reviews) return '';
        
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
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

    highlightSearchTerm(text) {
        if (!this.searchTerm) return text;
        
        const regex = new RegExp(`(${this.searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    viewProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Modal simple para mostrar detalles del producto
        const modal = document.createElement('div');
        modal.className = 'modal product-detail-modal';
        modal.innerHTML = `
            <div class="modal-content product-detail-content">
                <span class="close">&times;</span>
                <div class="product-detail">
                    <div class="product-detail-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 300 200&quot;><rect fill=&quot;%23f0f0f0&quot; width=&quot;300&quot; height=&quot;200&quot;/><text x=&quot;50%&quot; y=&quot;50%&quot; text-anchor=&quot;middle&quot; dy=&quot;.3em&quot; font-size=&quot;48&quot;>${CATEGORY_EMOJIS[product.category] || '📦'}</text></svg>'">
                    </div>
                    <div class="product-detail-info">
                        <h2>${product.name}</h2>
                        <div class="product-category-tag">${CATEGORIES[product.category]}</div>
                        ${this.createRatingDisplay(product)}
                        <p class="product-description">${product.description}</p>
                        <div class="product-detail-price">${Format.currency(product.price)}</div>
                        <div class="product-detail-stock">
                            ${product.inStock ? 
                                '<span class="in-stock"><i class="fas fa-check-circle"></i> En Stock</span>' : 
                                '<span class="out-of-stock"><i class="fas fa-times-circle"></i> Agotado</span>'
                            }
                        </div>
                        <div class="product-detail-actions">
                            <button class="btn ${!product.inStock ? 'btn-disabled' : ''}" 
                                    onclick="cart.addItem(${product.id}); this.closest('.modal').remove();"
                                    ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i> 
                                ${product.inStock ? 'Agregar al Carrito' : 'Agotado'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Cerrar modal
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Cerrar con tecla Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Tracking
        Analytics.trackEvent('Producto', 'Ver Detalles', product.name);
    }

    // Método para agregar al carrito
    addToCart(productId) {
        const success = cart.addItem(productId);
        
        if (success) {
            // Animación visual en el botón
            const btn = event.target.closest('button');
            if (btn && !btn.disabled) {
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                btn.style.background = '#28a745';
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                }, 2000);
            }

            // Tracking para catálogo
            Analytics.trackEvent('Catalogo', 'Agregar Producto', 
                products.find(p => p.id === productId)?.name);
        }
    }

    // Métodos de utilidad para navegación
    goToCategory(category) {
        this.setFilter(category);
        window.history.pushState(
            { category }, 
            `Catálogo - ${CATEGORIES[category]}`, 
            `catalogo.html?category=${category}`
        );
    }

    searchProducts(query) {
        this.setSearchTerm(query);
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
        window.history.pushState(
            { search: query }, 
            `Catálogo - Búsqueda: ${query}`, 
            `catalogo.html?search=${encodeURIComponent(query)}`
        );
    }
}

// Inicializar catálogo cuando todo esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('catalogo.html')) {
        setTimeout(() => {
            if (typeof products !== 'undefined' && products.length > 0) {
                console.log('📦 Productos encontrados:', products.length);
                const catalogManager = new CatalogManager();
                window.catalogManager = catalogManager;
                console.log('✅ Catálogo listo');
            } else {
                console.error('❌ No se encontraron productos');
            }
        }, 300);
    }
});