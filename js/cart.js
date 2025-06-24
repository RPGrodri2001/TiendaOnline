// Gestión del carrito de compras mejorada

class ShoppingCart {
    constructor() {
        this.items = [];
        this.selectedPayment = '';
        this.isModalOpen = false;
        this.init();
    }

    init() {
        this.loadCart();
        this.bindEvents();
    }

    bindEvents() {
        // Event listeners para el carrito
        const cartIcon = document.getElementById('cartIcon');
        const closeCart = document.getElementById('closeCart');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const modal = document.getElementById('cartModal');
        const paymentMethods = document.getElementById('paymentMethods');

        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.toggleModal());
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => this.toggleModal());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        if (paymentMethods) {
            paymentMethods.addEventListener('click', (e) => {
                const paymentMethod = e.target.closest('.payment-method');
                if (paymentMethod) {
                    this.selectPayment(paymentMethod.dataset.payment);
                }
            });
        }

        // Cerrar modal al hacer clic fuera
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.toggleModal();
                }
            });
        }

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.toggleModal();
            }
        });
    }

    loadCart() {
        try {
            const savedCart = Storage.get(CONFIG.STORAGE_KEYS.CART);
            this.items = Array.isArray(savedCart) ? savedCart : [];
            this.updateUI();
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            this.items = [];
            Notifications.error('Error al cargar el carrito guardado');
        }
    }

    saveCart() {
        try {
            const success = Storage.set(CONFIG.STORAGE_KEYS.CART, this.items);
            if (!success) {
                Notifications.warning('No se pudo guardar el carrito');
            }
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            Notifications.error('Error al guardar el carrito');
        }
    }

    addItem(productId, quantity = 1) {
        try {
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                Notifications.error('Producto no encontrado');
                return false;
            }

            if (!product.inStock) {
                Notifications.warning('Producto fuera de stock');
                return false;
            }

            if (!Validation.isPositiveNumber(quantity)) {
                Notifications.error('Cantidad inválida');
                return false;
            }

            const existingItem = this.items.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
                Notifications.success(`Cantidad actualizada: ${product.name}`);
            } else {
                this.items.push({
                    ...product,
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                });
                Notifications.success(`Agregado al carrito: ${product.name}`);
            }

            this.updateUI();
            this.saveCart();
            
            // Tracking de analytics
            Analytics.trackEvent('Carrito', 'Agregar Producto', product.name, product.price);
            
            return true;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            Notifications.error('Error al agregar producto al carrito');
            return false;
        }
    }

    updateQuantity(productId, change) {
        try {
            const item = this.items.find(item => item.id === productId);
            
            if (!item) {
                Notifications.error('Producto no encontrado en el carrito');
                return false;
            }

            const newQuantity = item.quantity + change;

            if (newQuantity <= 0) {
                return this.removeItem(productId);
            }

            if (newQuantity > 99) {
                Notifications.warning('Cantidad máxima alcanzada (99)');
                return false;
            }

            item.quantity = newQuantity;
            this.updateUI();
            this.saveCart();
            
            return true;
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            Notifications.error('Error al actualizar cantidad');
            return false;
        }
    }

    removeItem(productId) {
        try {
            const itemIndex = this.items.findIndex(item => item.id === productId);
            
            if (itemIndex === -1) {
                Notifications.error('Producto no encontrado en el carrito');
                return false;
            }

            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            
            Notifications.success(`${removedItem.name} eliminado del carrito`);
            this.updateUI();
            this.saveCart();
            
            // Tracking de analytics
            Analytics.trackEvent('Carrito', 'Eliminar Producto', removedItem.name);
            
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            Notifications.error('Error al eliminar producto');
            return false;
        }
    }

    clear() {
        try {
            this.items = [];
            this.selectedPayment = '';
            this.updateUI();
            this.saveCart();
            Notifications.success('Carrito vaciado');
            
            // Tracking de analytics
            Analytics.trackEvent('Carrito', 'Vaciar Carrito');
            
            return true;
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            Notifications.error('Error al vaciar el carrito');
            return false;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    updateUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
        this.updateCheckoutButton();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Tu carrito está vacío</p>
                    <p style="font-size: 0.9rem;">¡Agrega algunos productos para empezar!</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = '';
        
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.style.display='none';"
                     loading="lazy">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${Format.currency(item.price)} c/u</p>
                    <small style="color: #999;">
                        Subtotal: ${Format.currency(item.price * item.quantity)}
                    </small>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, -1)" 
                            title="Disminuir cantidad">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: bold;">
                        ${item.quantity}
                    </span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, 1)"
                            title="Aumentar cantidad">+</button>
                    <button class="quantity-btn remove-btn" onclick="cart.removeItem(${item.id})"
                            title="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    updateCartTotal() {
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            const total = this.getTotal();
            cartTotal.innerHTML = `
                <div>
                    <div style="font-size: 1rem; color: #666; margin-bottom: 0.5rem;">
                        ${this.getTotalItems()} producto(s)
                    </div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #8B4513;">
                        Total: ${Format.currency(total)}
                    </div>
                </div>
            `;
        }
    }

    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            const hasItems = this.items.length > 0;
            checkoutBtn.disabled = !hasItems;
            checkoutBtn.textContent = hasItems ? 'Proceder al Pago' : 'Carrito Vacío';
        }
    }

    selectPayment(method) {
        try {
            this.selectedPayment = method;
            
            // Actualizar UI de métodos de pago
            document.querySelectorAll('.payment-method').forEach(el => {
                el.classList.remove('selected');
            });
            
            const selectedElement = document.querySelector(`[data-payment="${method}"]`);
            if (selectedElement) {
                selectedElement.classList.add('selected');
            }
            
            // Tracking de analytics
            Analytics.trackEvent('Checkout', 'Seleccionar Método Pago', method);
            
        } catch (error) {
            console.error('Error al seleccionar método de pago:', error);
            Notifications.error('Error al seleccionar método de pago');
        }
    }

    toggleModal() {
        const modal = document.getElementById('cartModal');
        if (!modal) return;

        this.isModalOpen = !this.isModalOpen;
        
        if (this.isModalOpen) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.updateUI(); // Actualizar contenido al abrir
            
            // Tracking de analytics
            Analytics.trackEvent('Carrito', 'Abrir Modal');
        } else {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Tracking de analytics
            Analytics.trackEvent('Carrito', 'Cerrar Modal');
        }
    }

    async checkout() {
        try {
            // Validaciones
            if (this.items.length === 0) {
                Notifications.warning('El carrito está vacío');
                return false;
            }

            if (!this.selectedPayment) {
                Notifications.warning('Por favor selecciona un método de pago');
                return false;
            }

            // Verificar stock antes del checkout
            const outOfStockItems = this.items.filter(item => {
                const product = products.find(p => p.id === item.id);
                return !product || !product.inStock;
            });

            if (outOfStockItems.length > 0) {
                Notifications.error('Algunos productos ya no están disponibles');
                return false;
            }

            // Mostrar loading
            const checkoutBtn = document.getElementById('checkoutBtn');
            const originalText = checkoutBtn.textContent;
            checkoutBtn.innerHTML = '<span class="loading"></span> Procesando...';
            checkoutBtn.disabled = true;

            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Datos de la transacción
            const transactionId = `TXN_${Date.now()}`;
            const total = this.getTotal();
            const itemsData = this.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            // Tracking de compra
            Analytics.trackPurchase(transactionId, itemsData, total);

            // Mostrar éxito
            Notifications.success(
                `¡Compra realizada con éxito!<br>
                 ID: ${transactionId}<br>
                 Total: ${Format.currency(total)}<br>
                 Método: ${this.selectedPayment}`,
                'success',
                5000
            );

            // Limpiar carrito y cerrar modal
            this.clear();
            this.toggleModal();

            return true;

        } catch (error) {
            console.error('Error en checkout:', error);
            Notifications.error('Error al procesar el pago. Inténtalo de nuevo.');
            return false;
        } finally {
            // Restaurar botón
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.innerHTML = 'Proceder al Pago';
                checkoutBtn.disabled = false;
            }
        }
    }

    // Métodos adicionales para análisis
    getCartSummary() {
        return {
            totalItems: this.getTotalItems(),
            totalValue: this.getTotal(),
            categories: this.getCategories(),
            averageItemValue: this.getAverageItemValue()
        };
    }

    getCategories() {
        const categories = {};
        this.items.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + item.quantity;
        });
        return categories;
    }

    getAverageItemValue() {
        if (this.items.length === 0) return 0;
        return this.getTotal() / this.getTotalItems();
    }
}

// Crear instancia global del carrito
const cart = new ShoppingCart();