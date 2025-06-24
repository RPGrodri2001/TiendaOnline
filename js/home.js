// Gestor específico para la página de inicio

class HomeManager {
    constructor() {
        this.featuredProducts = [];
        this.init();
    }

    init() {
        this.selectFeaturedProducts();
        this.renderFeaturedProducts();
    }

    selectFeaturedProducts() {
        // Seleccionar productos destacados (mejor valorados y en stock)
        const availableProducts = products.filter(p => p.inStock);
        
        // Ordenar por rating y tomar los mejores
        const sortedByRating = [...availableProducts].sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA;
        });

        // Tomar 3 productos de cada categoría si es posible
        const featuredByCategory = {
            chocolates: sortedByRating.filter(p => p.category === 'chocolates').slice(0, 3),
            flores: sortedByRating.filter(p => p.category === 'flores').slice(0, 3),
            otros: sortedByRating.filter(p => p.category === 'otros').slice(0, 3)
        };

        // Combinar y tomar los primeros 9
        this.featuredProducts = [
            ...featuredByCategory.chocolates,
            ...featuredByCategory.flores,
            ...featuredByCategory.otros
        ].slice(0, 9);

        // Si no hay suficientes productos, completar con los disponibles
        if (this.featuredProducts.length < 9) {
            const remainingProducts = availableProducts
                .filter(p => !this.featuredProducts.includes(p))
                .slice(0, 9 - this.featuredProducts.length);
            
            this.featuredProducts = [...this.featuredProducts, ...remainingProducts];
        }
    }

    renderFeaturedProducts() {
        const productGrid = document.getElementById('featuredProductGrid');
        if (!productGrid) return;

        productGrid.innerHTML = '';
        
        this.featuredProducts.forEach((product, index) => {
            const productCard = this.createFeaturedProductCard(product, index);
            productGrid.appendChild(productCard);
        });
    }

    createFeaturedProductCard(product, index) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card featured-card';
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
                <div class="featured-badge">
                    <i class="fas fa-star"></i> Destacado
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${this.createRatingDisplay(product)}
                <div class="product-price">${Format.currency(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-small ${isOutOfStock ? 'btn-disabled' : ''}" 
                            onclick="homeManager.addToCart(${product.id})"
                            ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> 
                        ${isOutOfStock ? 'Agotado' : 'Agregar'}
                    </button>
                    <a href="catalogo.html?category=${product.category}" 
                       class="btn btn-small btn-secondary">
                        <i class="fas fa-eye"></i> Ver Más
                    </a>
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
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                btn.style.background = '#28a745';
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                }, 2000);
            }

            // Tracking para productos destacados
            Analytics.trackEvent('Inicio', 'Agregar Producto Destacado', 
                products.find(p => p.id === productId)?.name);
        }
    }

    // Método para actualizar productos destacados dinámicamente
    refreshFeaturedProducts() {
        this.selectFeaturedProducts();
        this.renderFeaturedProducts();
    }

    // Método para obtener estadísticas de productos destacados
    getFeaturedStats() {
        const totalValue = this.featuredProducts.reduce((sum, p) => sum + p.price, 0);
        const avgRating = this.featuredProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / this.featuredProducts.length;
        
        return {
            count: this.featuredProducts.length,
            totalValue: totalValue,
            avgRating: avgRating,
            categories: this.featuredProducts.reduce((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Crear instancia del gestor de inicio solo si estamos en la página principal
if (!window.location.pathname.includes('catalogo.html') && !document.title.includes('Catálogo')) {
    const homeManager = new HomeManager();
    
    // Exponer para uso global en el inicio
    window.homeManager = homeManager;
}