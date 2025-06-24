// Funciones utilitarias mejoradas

/**
 * Manejo de almacenamiento local con manejo de errores
 */
const Storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error al obtener ${key} del localStorage:`, error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error al guardar ${key} en localStorage:`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error al eliminar ${key} del localStorage:`, error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
            return false;
        }
    }
};

/**
 * Sistema de notificaciones mejorado
 */
const Notifications = {
    container: null,

    init() {
        this.container = document.getElementById('notificationContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 3000;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'success', duration = CONFIG.NOTIFICATION_DURATION) {
        if (!this.container) this.init();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: ${this.getTextColor(type)};
            padding: 1rem 1.5rem;
            border-radius: 5px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="${this.getIcon(type)}"></i>
                <span>${message}</span>
                <i class="fas fa-times" style="margin-left: auto; cursor: pointer;" onclick="this.parentElement.parentElement.remove()"></i>
            </div>
        `;

        this.container.appendChild(notification);

        // Auto-remove después de la duración especificada
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);

        // Permitir cerrar manualmente
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });

        return notification;
    },

    getBackgroundColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.success;
    },

    getTextColor(type) {
        return type === 'warning' ? '#333' : 'white';
    },

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.success;
    },

    success(message) { return this.show(message, 'success'); },
    error(message) { return this.show(message, 'error'); },
    warning(message) { return this.show(message, 'warning'); },
    info(message) { return this.show(message, 'info'); }
};

/**
 * Utilidades para validación
 */
const Validation = {
    isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    isEmpty(value) {
        return !value || value.toString().trim() === '';
    },

    isPositiveNumber(value) {
        return !isNaN(value) && parseFloat(value) > 0;
    },

    sanitizeInput(input) {
        return input.toString()
            .replace(/[<>]/g, '')
            .trim();
    }
};

/**
 * Utilidades para formateo
 */
const Format = {
    currency(amount, currency = 'USD') {
        try {
            return new Intl.NumberFormat('es-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        } catch (error) {
            console.error('Error al formatear moneda:', error);
            return `${amount.toFixed(2)}`;
        }
    },

    number(num, decimals = 0) {
        try {
            return new Intl.NumberFormat('es-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        } catch (error) {
            console.error('Error al formatear número:', error);
            return num.toFixed(decimals);
        }
    },

    date(date, options = {}) {
        try {
            const defaultOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Intl.DateTimeFormat('es-ES', { ...defaultOptions, ...options }).format(new Date(date));
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return date.toString();
        }
    }
};

/**
 * Utilidades para manejo de imágenes
 */
const ImageUtils = {
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                reject(new Error('Timeout al cargar imagen'));
            }, CONFIG.IMAGE_LOADING_TIMEOUT);

            img.onload = () => {
                clearTimeout(timeout);
                resolve(img);
            };

            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Error al cargar imagen'));
            };

            img.src = src;
        });
    },

    async loadImageWithFallback(imgElement, src, category) {
        try {
            await this.preloadImage(src);
            imgElement.src = src;
            imgElement.style.display = 'block';
            imgElement.nextElementSibling?.style.setProperty('display', 'none');
        } catch (error) {
            console.warn(`Error al cargar imagen ${src}:`, error);
            this.showFallback(imgElement, category);
        }
    },

    showFallback(imgElement, category) {
        imgElement.style.display = 'none';
        const fallback = imgElement.nextElementSibling;
        if (fallback) {
            fallback.style.display = 'flex';
            fallback.textContent = CATEGORY_EMOJIS[category] || '📦';
        }
    },

    lazy(selector = 'img[data-lazy]') {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.lazy;
                        const category = img.dataset.category;
                        
                        this.loadImageWithFallback(img, src, category);
                        img.removeAttribute('data-lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll(selector).forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores sin soporte
            document.querySelectorAll(selector).forEach(img => {
                const src = img.dataset.lazy;
                const category = img.dataset.category;
                this.loadImageWithFallback(img, src, category);
                img.removeAttribute('data-lazy');
            });
        }
    }
};

/**
 * Utilidades para debounce y throttle
 */
const Performance = {
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/**
 * Utilidades para navegación suave
 */
const Navigation = {
    smoothScroll(targetId, offset = 80) {
        const target = document.querySelector(targetId);
        if (target) {
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    initSmoothLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                this.smoothScroll(targetId);
            });
        });
    }
};

/**
 * Utilidades para análisis y métricas
 */
const Analytics = {
    trackEvent(category, action, label = null, value = null) {
        // Implementar seguimiento de eventos
        console.log('Evento:', { category, action, label, value });
        
        // Ejemplo de implementación con Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
    },

    trackPageView(page) {
        console.log('Vista de página:', page);
        
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: page,
                page_location: window.location.href
            });
        }
    },

    trackPurchase(transactionId, items, total) {
        console.log('Compra realizada:', { transactionId, items, total });
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: total,
                currency: 'USD',
                items: items
            });
        }
    }
};

// Agregar estilos para animaciones de notificaciones
const addNotificationStyles = () => {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

// Inicializar estilos cuando se carga el script
addNotificationStyles();