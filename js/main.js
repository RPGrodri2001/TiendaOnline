// Archivo principal de la aplicación

class DulceAromaApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializar componentes principales
            await this.initializeComponents();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            // Configurar navegación
            this.setupNavigation();
            
            // Inicializar notificaciones
            Notifications.init();
            
            // Mostrar mensaje de bienvenida
            this.showWelcomeMessage();
            
            // Marcar como inicializada
            this.isInitialized = true;
            
            console.log('✅ Dulce Aroma App inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeComponents() {
        // Los componentes ya se inicializan automáticamente al cargar sus scripts
        // pero podemos hacer verificaciones adicionales aquí
        
        if (typeof cart === 'undefined') {
            throw new Error('El carrito no se inicializó correctamente');
        }
        
        if (typeof productManager === 'undefined') {
            throw new Error('El gestor de productos no se inicializó correctamente');
        }
        
        // Verificar que los elementos del DOM existan
        const requiredElements = [
            'cartIcon',
            'cartModal',
            'productGrid'
        ];
        
        for (const elementId of requiredElements) {
            if (!document.getElementById(elementId)) {
                console.warn(`⚠️ Elemento requerido no encontrado: ${elementId}`);
            }
        }
    }

    setupGlobalEvents() {
        // Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('Error detectado:', event.error);
    // Solo log en consola, sin notificaciones al usuario
});

        // Manejo de errores de promesas no capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection:', event.reason);
    // Solo log en consola, sin notificaciones al usuario
});

        // Manejo de cambios de conectividad
        window.addEventListener('online', () => {
            Notifications.success('Conexión restaurada');
        });

        window.addEventListener('offline', () => {
            Notifications.warning('Sin conexión a internet');
        });

        // Manejo de cambio de tamaño de ventana
        const handleResize = Performance.throttle(() => {
            this.handleWindowResize();
        }, 250);
        
        window.addEventListener('resize', handleResize);

        // Manejo de scroll para efectos adicionales
        const handleScroll = Performance.throttle(() => {
            this.handleScroll();
        }, 100);
        
        window.addEventListener('scroll', handleScroll);

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    setupNavigation() {
        // Inicializar navegación suave
        Navigation.initSmoothLinks();
        
        // Manejar navegación del historial
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.section) {
                Navigation.smoothScroll(`#${event.state.section}`);
            }
        });

        // Actualizar el estado del historial cuando se navega
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                if (targetId) {
                    history.pushState({ section: targetId }, '', `#${targetId}`);
                }
            });
        });
    }

    handleWindowResize() {
        // Ajustes específicos para diferentes tamaños de pantalla
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Ajustes para móvil
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Efecto de parallax ligero en el hero
        const hero = document.querySelector('.hero');
        if (hero && scrollTop < hero.offsetHeight) {
            const parallaxValue = scrollTop * 0.5;
            hero.style.transform = `translateY(${parallaxValue}px)`;
        }

        // Mostrar/ocultar botón de volver arriba
        this.toggleBackToTopButton(scrollTop > 300);
    }

    toggleBackToTopButton(show) {
        let backToTopBtn = document.getElementById('backToTop');
        
        if (show && !backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'backToTop';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.className = 'back-to-top-btn';
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #8B4513;
                color: white;
                border: none;
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            backToTopBtn.addEventListener('mouseenter', () => {
                backToTopBtn.style.transform = 'scale(1.1)';
            });
            
            backToTopBtn.addEventListener('mouseleave', () => {
                backToTopBtn.style.transform = 'scale(1)';
            });
            
            document.body.appendChild(backToTopBtn);
        } else if (!show && backToTopBtn) {
            backToTopBtn.remove();
        }
    }

    handleKeyboardShortcuts(e) {
        // Atajos de teclado útiles
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k': // Ctrl+K para buscar
                    e.preventDefault();
                    const searchInput = document.getElementById('searchInput');
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                    }
                    break;
                    
                case 'Enter': // Ctrl+Enter para checkout rápido
                    if (cart.items.length > 0) {
                        e.preventDefault();
                        cart.toggleModal();
                    }
                    break;
            }
        }

        // Escape para cerrar modales
        if (e.key === 'Escape') {
            if (cart.isModalOpen) {
                cart.toggleModal();
            }
        }

        // Teclas de filtrado rápido
        if (e.altKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    productManager.setFilter('all');
                    break;
                case '2':
                    e.preventDefault();
                    productManager.setFilter('chocolates');
                    break;
                case '3':
                    e.preventDefault();
                    productManager.setFilter('flores');
                    break;
                case '4':
                    e.preventDefault();
                    productManager.setFilter('otros');
                    break;
            }
        }
    }

    showWelcomeMessage() {
        // Mostrar mensaje de bienvenida solo la primera vez
        const hasVisited = Storage.get('dulceAroma_hasVisited');
        
        if (!hasVisited) {
            setTimeout(() => {
                Notifications.info(
                    'Bienvenido a Dulce Aroma 🍫<br>' +
                    'Usa Ctrl+K para buscar productos<br>' +
                    'Alt+1,2,3,4 para filtros rápidos',
                    'info',
                    5000
                );
            }, 1000);
            
            Storage.set('dulceAroma_hasVisited', true);
        }
    }

    handleInitializationError(error) {
        // Mostrar mensaje de error amigable al usuario
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                font-family: Arial, sans-serif;
                background: #f8f9fa;
                color: #333;
                padding: 2rem;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    max-width: 500px;
                ">
                    <i class="fas fa-exclamation-triangle" style="
                        font-size: 3rem;
                        color: #ffc107;
                        margin-bottom: 1rem;
                    "></i>
                    <h2>Oops! Algo salió mal</h2>
                    <p>No pudimos cargar la aplicación correctamente.</p>
                    <p style="font-size: 0.9rem; color: #666;">
                        Por favor, recarga la página o contacta con soporte si el problema persiste.
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: #8B4513;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1rem;
                        margin-top: 1rem;
                    ">
                        Recargar página
                    </button>
                </div>
            </div>
        `;
    }

    // Métodos públicos para interacción externa
    getAppStatus() {
        return {
            initialized: this.isInitialized,
            cartItems: cart.getTotalItems(),
            totalProducts: products.length,
            currentFilter: productManager.currentFilter,
            searchTerm: productManager.searchTerm
        };
    }

    exportData() {
        return {
            cart: cart.items,
            products: products,
            config: CONFIG,
            timestamp: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.cart && Array.isArray(data.cart)) {
                cart.items = data.cart;
                cart.updateUI();
                cart.saveCart();
            }
            
            Notifications.success('Datos importados correctamente');
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            Notifications.error('Error al importar datos');
            return false;
        }
    }
}

// Inicializar la aplicación
const app = new DulceAromaApp();

// Exponer funciones globales para compatibilidad con HTML inline
window.addToCart = (productId) => cart.addItem(productId);
window.toggleCart = () => cart.toggleModal();
window.selectPayment = (method) => cart.selectPayment(method);
window.checkout = () => cart.checkout();

// Funciones de utilidad global
window.DulceAromaUtils = {
    getStats: () => ({
        app: app.getAppStatus(),
        products: productManager.getProductStats(),
        cart: cart.getCartSummary()
    }),
    exportData: () => app.exportData(),
    importData: (data) => app.importData(data),
    clearAllData: () => {
        Storage.clear();
        window.location.reload();
    }
};

// Debug helpers (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🛠️ Modo desarrollo activado');
    console.log('Usa DulceAromaUtils para herramientas de debug');
    console.log('Ejemplo: DulceAromaUtils.getStats()');
    
    window.DEBUG = {
        cart,
        productManager,
        app,
        Storage,
        Notifications,
        Analytics
    };
}