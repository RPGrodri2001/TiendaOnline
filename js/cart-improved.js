// ===== CARRITO MEJORADO CON SCROLL ===== //

// Actualizar estructura HTML del modal
function updateCartModalStructure() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    // HTML actualizado con estructura mejorada
    modal.innerHTML = `
        <div class="modal-content">
            <!-- Header fijo -->
            <div class="modal-header">
                <h2>Carrito de Compras</h2>
                <button class="close" id="closeCart">&times;</button>
            </div>
            
            <!-- Cuerpo con scroll -->
            <div class="modal-body" id="cartItemsContainer">
                <div id="cartItems"></div>
            </div>
            
            <!-- Footer fijo -->
            <div class="modal-footer">
                <!-- Resumen del carrito -->
                <div class="cart-summary" id="cartSummary">
                    <div class="cart-summary-info">
                        <i class="fas fa-shopping-bag"></i> 0 productos
                    </div>
                    <div class="cart-summary-total">$0.00</div>
                </div>
                
                <!-- Métodos de pago -->
                <h4 style="margin: 1rem 0 0.5rem; color: #495057; font-size: 1rem;">Método de Pago</h4>
                <div class="payment-methods" id="paymentMethods">
                    <div class="payment-method" data-payment="tarjeta">
                        <i class="fas fa-credit-card"></i>
                        <p>Tarjeta</p>
                    </div>
                    <div class="payment-method" data-payment="paypal">
                        <i class="fab fa-paypal"></i>
                        <p>PayPal</p>
                    </div>
                    <div class="payment-method" data-payment="efectivo">
                        <i class="fas fa-money-bill-wave"></i>
                        <p>Efectivo</p>
                    </div>
                </div>
                
                <!-- Botón de checkout -->
                <button class="checkout-btn" id="checkoutBtn">
                    <i class="fas fa-credit-card"></i> Proceder al Pago
                </button>
            </div>
            
            <!-- Indicador de scroll -->
            <div class="scroll-indicator" id="scrollIndicator">
                <i class="fas fa-arrow-down"></i> Más productos abajo
            </div>
        </div>
    `;
}

// Funciones mejoradas para el carrito
const ImprovedCart = {
    items: [],
    selectedPayment: '',
    isOpen: false,

    init() {
        this.loadCart();
        this.updateModalStructure();
        this.bindEvents();
        this.updateUI();
    },

    updateModalStructure() {
        updateCartModalStructure();
    },

    bindEvents() {
        // Eventos del modal
        const closeBtn = document.getElementById('closeCart');
        const modal = document.getElementById('cartModal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const paymentMethods = document.getElementById('paymentMethods');
        const cartIcon = document.getElementById('cartIcon');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        if (paymentMethods) {
            paymentMethods.addEventListener('click', (e) => {
                const method = e.target.closest('.payment-method');
                if (method) {
                    this.selectPayment(method.dataset.payment);
                }
            });
        }

        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.toggleModal());
        }

        // Eventos de scroll
        this.bindScrollEvents();

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeModal();
            }
        });
    },

    bindScrollEvents() {
        const cartContainer = document.getElementById('cartItemsContainer');
        const scrollIndicator = document.getElementById('scrollIndicator');
        
        if (cartContainer && scrollIndicator) {
            cartContainer.addEventListener('scroll', () => {
                const { scrollTop, scrollHeight, clientHeight } = cartContainer;
                const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10;
                
                // Mostrar/ocultar indicador de scroll
                if (scrollHeight > clientHeight && !isScrolledToBottom) {
                    scrollIndicator.classList.add('show');
                } else {
                    scrollIndicator.classList.remove('show');
                }
            });
        }
    },

    loadCart() {
        try {
            const saved = localStorage.getItem('threeSenses_cart');
            this.items = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error cargando carrito:', error);
            this.items = [];
        }
    },

    saveCart() {
        try {
            localStorage.setItem('threeSenses_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    },

    addItem(productId, quantity = 1) {
        // Buscar producto
        const product = products.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return false;
        }

        // Verificar si ya existe
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            this.showNotification(`Cantidad actualizada: ${product.name}`, 'success');
        } else {
            this.items.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
            this.showNotification(`Agregado al carrito: ${product.name}`, 'success');
        }

        this.updateUI();
        this.saveCart();
        this.animateCartIcon();
        
        return true;
    },

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return false;

        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            return this.removeItem(productId);
        }

        if (newQuantity > 99) {
            this.showNotification('Cantidad máxima: 99', 'warning');
            return false;
        }

        item.quantity = newQuantity;
        this.updateUI();
        this.saveCart();
        
        return true;
    },

    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        if (itemIndex === -1) return false;

        const item = this.items[itemIndex];
        
        // Animar salida
        const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (itemElement) {
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.transform = 'translateX(-100%)';
            itemElement.style.opacity = '0';
            
            setTimeout(() => {
                this.items.splice(itemIndex, 1);
                this.updateUI();
                this.saveCart();
                this.showNotification(`${item.name} eliminado`, 'success');
            }, 300);
        } else {
            this.items.splice(itemIndex, 1);
            this.updateUI();
            this.saveCart();
            this.showNotification(`${item.name} eliminado`, 'success');
        }

        return true;
    },

    clear() {
        if (this.items.length === 0) return;
        
        if (confirm('¿Vaciar todo el carrito?')) {
            this.items = [];
            this.updateUI();
            this.saveCart();
            this.showNotification('Carrito vaciado', 'success');
        }
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },

    updateUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartSummary();
        this.updateCheckoutButton();
        this.updateScrollIndicator();
    },

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Agrega algunos productos increíbles!</p>
                    <button class="btn" onclick="window.location.href='catalogo.html'" style="margin-top: 1rem;">
                        <i class="fas fa-search"></i> Explorar Productos
                    </button>
                </div>
            `;
            return;
        }

        let itemsHTML = '';
        this.items.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            itemsHTML += `
                <div class="cart-item" data-product-id="${item.id}" style="animation-delay: ${index * 0.1}s">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAxNUMzMy4zMTM3IDE1IDM2IDE3LjY4NjMgMzYgMjFDMzYgMjQuMzEzNyAzMy4zMTM3IDI3IDMwIDI3QzI2LjY4NjMgMjcgMjQgMjQuMzEzNyAyNCAyMUMyNCAyMS42ODYzIDI0LjY4NjMgMjEgMjUgMjFIMzVDMzUgMTcuNjg2MyAzMi4zMTM3IDE1IDI5IDE1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K'">
                    
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${this.formatCurrency(item.price)} c/u</p>
                        <div class="item-price">
                            Subtotal: ${this.formatCurrency(subtotal)}
                        </div>
                    </div>
                    
                    <div class="cart-item-controls">
                        <button class="quantity-btn" 
                                onclick="cart.updateQuantity(${item.id}, -1)" 
                                title="Disminuir cantidad"
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        
                        <div class="quantity-display">${item.quantity}</div>
                        
                        <button class="quantity-btn" 
                                onclick="cart.updateQuantity(${item.id}, 1)"
                                title="Aumentar cantidad"
                                ${item.quantity >= 99 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                        
                        <button class="quantity-btn remove-btn" 
                                onclick="cart.removeItem(${item.id})"
                                title="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartItems.innerHTML = itemsHTML;

        // Animar entrada de items
        const itemElements = cartItems.querySelectorAll('.cart-item');
        itemElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    updateCartSummary() {
        const cartSummary = document.getElementById('cartSummary');
        if (!cartSummary) return;

        const total = this.getTotal();
        const totalItems = this.getTotalItems();

        cartSummary.innerHTML = `
            <div class="cart-summary-info">
                <i class="fas fa-shopping-bag"></i> 
                ${totalItems} producto${totalItems !== 1 ? 's' : ''}
            </div>
            <div class="cart-summary-total">
                ${this.formatCurrency(total)}
            </div>
        `;

        // Animar actualización
        cartSummary.style.transform = 'scale(1.02)';
        setTimeout(() => {
            cartSummary.style.transform = 'scale(1)';
        }, 200);
    },

    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (!checkoutBtn) return;

        const hasItems = this.items.length > 0;
        const total = this.getTotal();

        checkoutBtn.disabled = !hasItems;
        
        if (!hasItems) {
            checkoutBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Carrito Vacío';
        } else {
            checkoutBtn.innerHTML = `
                <i class="fas fa-credit-card"></i> 
                Pagar ${this.formatCurrency(total)}
            `;
        }
    },

    updateScrollIndicator() {
        const cartContainer = document.getElementById('cartItemsContainer');
        const scrollIndicator = document.getElementById('scrollIndicator');
        
        if (cartContainer && scrollIndicator) {
            setTimeout(() => {
                const hasScroll = cartContainer.scrollHeight > cartContainer.clientHeight;
                const isAtBottom = cartContainer.scrollTop + cartContainer.clientHeight >= cartContainer.scrollHeight - 10;
                
                if (hasScroll && !isAtBottom && this.items.length > 3) {
                    scrollIndicator.classList.add('show');
                } else {
                    scrollIndicator.classList.remove('show');
                }
            }, 100);
        }
    },

    selectPayment(method) {
        this.selectedPayment = method;
        
        // Actualizar UI
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        
        const selectedElement = document.querySelector(`[data-payment="${method}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
            
            // Animación de selección
            selectedElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                selectedElement.style.transform = 'scale(1)';
            }, 200);
        }

        // Guardar preferencia
        localStorage.setItem('threeSenses_payment', method);
        
        this.showNotification(`Método seleccionado: ${this.getPaymentMethodName(method)}`, 'success', 2000);
    },

    getPaymentMethodName(method) {
        const names = {
            'tarjeta': 'Tarjeta de Crédito/Débito',
            'paypal': 'PayPal',
            'efectivo': 'Efectivo contra entrega'
        };
        return names[method] || method;
    },

    async checkout() {
        // Validaciones
        if (this.items.length === 0) {
            this.showNotification('El carrito está vacío', 'warning');
            return false;
        }

        if (!this.selectedPayment) {
            this.showNotification('Selecciona un método de pago', 'warning');
            this.highlightPaymentMethods();
            return false;
        }

        // Mostrar loading
        const checkoutBtn = document.getElementById('checkoutBtn');
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '<span class="loading-spinner"></span> Procesando...';
        checkoutBtn.disabled = true;

        try {
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Datos de la transacción
            const transactionId = `TXN_${Date.now()}`;
            const total = this.getTotal();

            // Mostrar éxito
            this.showSuccessAnimation();
            
            this.showNotification(
                `¡Compra realizada con éxito! 🎉<br>
                 <strong>ID:</strong> ${transactionId}<br>
                 <strong>Total:</strong> ${this.formatCurrency(total)}<br>
                 <strong>Método:</strong> ${this.getPaymentMethodName(this.selectedPayment)}`,
                'success',
                6000
            );

            // Limpiar carrito
            setTimeout(() => {
                this.items = [];
                this.selectedPayment = '';
                this.updateUI();
                this.saveCart();
                this.closeModal();
            }, 3000);

            return true;

        } catch (error) {
            console.error('Error en checkout:', error);
            this.showNotification('Error al procesar el pago', 'error');
            return false;
        } finally {
            // Restaurar botón
            checkoutBtn.innerHTML = originalText;
            checkoutBtn.disabled = false;
        }
    },

    highlightPaymentMethods() {
        const paymentContainer = document.getElementById('paymentMethods');
        if (paymentContainer) {
            paymentContainer.style.animation = 'pulse 1s ease 3';
            setTimeout(() => {
                paymentContainer.style.animation = '';
            }, 3000);
        }
    },

    showSuccessAnimation() {
        const confetti = document.createElement('div');
        confetti.innerHTML = '🎉✨🎊';
        confetti.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            z-index: 10000;
            pointer-events: none;
            animation: confettiSuccess 3s ease-out forwards;
            text-align: center;
        `;
        
        document.body.appendChild(confetti);
        
        // Agregar keyframes
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiSuccess {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(0deg);
                        opacity: 0;
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
                        opacity: 1;
                    }
                    80% {
                        transform: translate(-50%, -50%) scale(1) rotate(360deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -200%) scale(0.5) rotate(540deg);
                        opacity: 0;
                    }
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 0.5rem;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => confetti.remove(), 3000);
    },

    toggleModal() {
        if (this.isOpen) {
            this.closeModal();
        } else {
            this.openModal();
        }
    },

    openModal() {
        const modal = document.getElementById('cartModal');
        if (!modal) return;

        this.isOpen = true;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Actualizar UI al abrir
        this.updateUI();
        
        // Focus para accesibilidad
        const closeBtn = document.getElementById('closeCart');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
    },

    closeModal() {
        const modal = document.getElementById('cartModal');
        if (!modal) return;

        this.isOpen = false;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Restaurar focus
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.focus();
        }
    },

    animateCartIcon() {
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.style.animation = 'none';
            setTimeout(() => {
                cartIcon.style.animation = 'cartWiggle 0.6s ease';
            }, 10);
        }
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    },

    showNotification(message, type = 'info', duration = 4000) {
        // Crear contenedor si no existe
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        notification.style.cssText = `
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: ${type === 'warning' ? '#333' : 'white'};
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        container.appendChild(notification);
        
        // Auto-remover
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        // Remover al hacer clic
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
    }
};

// CSS adicional para animaciones
if (!document.getElementById('cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes cartWiggle {
            0%, 100% { transform: rotate(0deg) scale(1.1); }
            25% { transform: rotate(-5deg) scale(1.1); }
            75% { transform: rotate(5deg) scale(1.1); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar carrito mejorado
let cart;

document.addEventListener('DOMContentLoaded', function() {
    cart = ImprovedCart;
    cart.init();
    
    console.log('🛒 Carrito mejorado inicializado');
});

// Función global para agregar productos
window.addToCart = function(productId, quantity = 1) {
    if (cart && cart.addItem) {
        return cart.addItem(productId, quantity);
    }
    console.error('Carrito no inicializado');
    return false;
};

// Exportar para compatibilidad
window.cart = ImprovedCart;