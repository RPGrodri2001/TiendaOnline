// Sistema JavaScript para mejorar la responsividad

class ResponsiveManager {
    constructor() {
        this.currentBreakpoint = '';
        this.isTouch = 'ontouchstart' in window;
        this.init();
    }

    init() {
        this.detectDevice();
        this.setupViewportMeta();
        this.setupBreakpointDetection();
        this.setupTouchOptimizations();
        this.setupOrientationChanges();
        this.setupResizeHandler();
        this.optimizeImages();
    }

    detectDevice() {
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            screenSize: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio || 1,
            isTouch: this.isTouch,
            connection: navigator.connection?.effectiveType || 'unknown'
        };

        // Detectar tipo de dispositivo
        if (/iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent)) {
            deviceInfo.type = 'tablet';
        } else if (/Mobile|iPhone|Android/i.test(navigator.userAgent)) {
            deviceInfo.type = 'mobile';
        } else {
            deviceInfo.type = 'desktop';
        }

        // Detectar OS
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            deviceInfo.os = 'ios';
        } else if (/Android/i.test(navigator.userAgent)) {
            deviceInfo.os = 'android';
        } else if (/Windows/i.test(navigator.userAgent)) {
            deviceInfo.os = 'windows';
        } else if (/Mac/i.test(navigator.userAgent)) {
            deviceInfo.os = 'macos';
        } else {
            deviceInfo.os = 'unknown';
        }

        this.deviceInfo = deviceInfo;
        document.body.classList.add(`device-${deviceInfo.type}`, `os-${deviceInfo.os}`);

        if (this.isTouch) {
            document.body.classList.add('touch-device');
        }

        console.log('📱 Device detected:', deviceInfo);
    }

    setupViewportMeta() {
        // Asegurar viewport meta correcto
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        // Configuración optimizada para diferentes dispositivos
        if (this.deviceInfo.type === 'mobile') {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        } else {
            viewport.content = 'width=device-width, initial-scale=1.0';
        }
    }

    setupBreakpointDetection() {
        const breakpoints = {
            xs: 480,
            sm: 768,
            md: 1024,
            lg: 1440,
            xl: 1920
        };

        const updateBreakpoint = () => {
            const width = window.innerWidth;
            let newBreakpoint = 'xs';

            if (width >= breakpoints.xl) newBreakpoint = 'xl';
            else if (width >= breakpoints.lg) newBreakpoint = 'lg';
            else if (width >= breakpoints.md) newBreakpoint = 'md';
            else if (width >= breakpoints.sm) newBreakpoint = 'sm';

            if (newBreakpoint !== this.currentBreakpoint) {
                document.body.classList.remove(`bp-${this.currentBreakpoint}`);
                document.body.classList.add(`bp-${newBreakpoint}`);
                this.currentBreakpoint = newBreakpoint;
                
                // Disparar evento personalizado
                window.dispatchEvent(new CustomEvent('breakpointChange', {
                    detail: { breakpoint: newBreakpoint, width }
                }));
            }
        };

        updateBreakpoint();
        window.addEventListener('resize', Performance.throttle(updateBreakpoint, 100));
    }

    setupTouchOptimizations() {
        if (!this.isTouch) return;

        // Mejorar scroll en dispositivos táctiles
        document.addEventListener('touchstart', () => {}, { passive: true });

        // Prevenir zoom accidental en inputs
        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                
                setTimeout(() => {
                    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
                }, 100);
            }
        });

        // Mejorar rendimiento en scroll
        let ticking = false;
        document.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    setupOrientationChanges() {
        const handleOrientationChange = () => {
            // Esperar a que se complete el cambio de orientación
            setTimeout(() => {
                // Reajustar elementos si es necesario
                this.adjustForOrientation();
                
                // Forzar recálculo de dimensiones
                window.dispatchEvent(new Event('resize'));
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Fallback para dispositivos que no soportan orientationchange
        let lastInnerHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            const currentInnerHeight = window.innerHeight;
            if (Math.abs(currentInnerHeight - lastInnerHeight) > 150) {
                handleOrientationChange();
                lastInnerHeight = currentInnerHeight;
            }
        });
    }

    adjustForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (this.deviceInfo.type === 'mobile') {
            if (isLandscape) {
                document.body.classList.add('mobile-landscape');
                document.body.classList.remove('mobile-portrait');
                
                // Ajustar altura del hero en landscape
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.height = '70vh';
                }
            } else {
                document.body.classList.add('mobile-portrait');
                document.body.classList.remove('mobile-landscape');
                
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.height = '';
                }
            }
        }
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            
            // Operaciones inmediatas
            this.updateViewportInfo();
            
            // Operaciones con delay para evitar lag
            resizeTimeout = setTimeout(() => {
                this.optimizeLayout();
                this.adjustModalSizes();
            }, 150);
        };

        window.addEventListener('resize', handleResize);
    }

    updateViewportInfo() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
    }

    optimizeLayout() {
        // Optimizar grid de productos según el ancho disponible
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            const containerWidth = productGrid.offsetWidth;
            const cardMinWidth = 280;
            const gap = 24;
            
            const possibleColumns = Math.floor((containerWidth + gap) / (cardMinWidth + gap));
            const columns = Math.max(1, Math.min(6, possibleColumns));
            
            productGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }
    }

    adjustModalSizes() {
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            
            if (vw < 480) {
                modal.style.width = '95%';
                modal.style.maxHeight = '90vh';
                modal.style.margin = '5% auto';
            } else if (vw < 768) {
                modal.style.width = '90%';
                modal.style.maxHeight = '85vh';
            } else {
                modal.style.width = '';
                modal.style.maxHeight = '';
                modal.style.margin = '';
            }
        });
    }

    optimizeImages() {
        // Lazy loading con IntersectionObserver
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadOptimizedImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observar imágenes existentes
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Observar imágenes futuras
            const productObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const images = node.querySelectorAll ? node.querySelectorAll('img[data-src]') : [];
                            images.forEach(img => imageObserver.observe(img));
                        }
                    });
                });
            });

            productObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    loadOptimizedImage(img) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const containerWidth = img.parentElement.offsetWidth;
        const optimizedWidth = Math.ceil(containerWidth * devicePixelRatio);
        
        // Determinar formato de imagen basado en soporte
        const supportsWebP = this.checkWebPSupport();
        const supportsAVIF = this.checkAVIFSupport();
        
        let imageSrc = img.dataset.src;
        
        // Si la imagen original es muy grande, usar parámetros de redimensionamiento
        if (imageSrc && containerWidth < 400) {
            // Para imágenes locales, mantener la URL original
            // Para CDNs, podrías agregar parámetros de optimización aquí
        }
        
        img.src = imageSrc;
        img.removeAttribute('data-src');
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    checkAVIFSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        try {
            return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        } catch {
            return false;
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Efecto parallax suave en hero
        const hero = document.querySelector('.hero');
        if (hero && scrollTop < hero.offsetHeight) {
            const parallaxValue = scrollTop * 0.3;
            hero.style.transform = `translateY(${parallaxValue}px)`;
        }
        
        // Mostrar/ocultar header en scroll (opcional)
        if (this.deviceInfo.type === 'mobile') {
            this.handleMobileScroll(scrollTop);
        }
    }

    handleMobileScroll(scrollTop) {
        const header = document.querySelector('header');
        if (!header) return;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Métodos públicos para testing
    getDeviceInfo() {
        return this.deviceInfo;
    }

    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }

    forceResize() {
        window.dispatchEvent(new Event('resize'));
    }
}

// Inicializar el gestor responsive
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveManager = new ResponsiveManager();
    
    // Agregar event listener para cambios de breakpoint
    window.addEventListener('breakpointChange', (e) => {
        console.log(`📐 Breakpoint changed to: ${e.detail.breakpoint} (${e.detail.width}px)`);
    });
});

// Utilidades para desarrollo
if (window.location.hostname === 'localhost') {
    window.testResponsive = {
        showDeviceInfo: () => console.table(window.responsiveManager.getDeviceInfo()),
        getCurrentBreakpoint: () => console.log('Current breakpoint:', window.responsiveManager.getCurrentBreakpoint()),
        simulateResize: (width, height) => {
            window.resizeTo(width, height);
            setTimeout(() => window.responsiveManager.forceResize(), 100);
        },
        testBreakpoints: () => {
            const breakpoints = [
                { name: 'Mobile Small', width: 375, height: 667 },
                { name: 'Mobile Large', width: 414, height: 896 },
                { name: 'Tablet', width: 768, height: 1024 },
                { name: 'Desktop', width: 1440, height: 900 },
                { name: 'Large Desktop', width: 1920, height: 1080 }
            ];
            
            let index = 0;
            const testNext = () => {
                if (index < breakpoints.length) {
                    const bp = breakpoints[index];
                    console.log(`Testing ${bp.name}: ${bp.width}x${bp.height}`);
                    window.resizeTo(bp.width, bp.height);
                    setTimeout(() => {
                        window.responsiveManager.forceResize();
                        index++;
                        setTimeout(testNext, 2000);
                    }, 100);
                }
            };
            testNext();
        }
    };
    
    console.log('🧪 Test utilities available: window.testResponsive');
}

// CSS adicional para estados responsive
const addResponsiveStyles = () => {
    if (!document.getElementById('responsive-dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'responsive-dynamic-styles';
        style.textContent = `
            /* Estados dinámicos para diferentes dispositivos */
            .device-mobile .nav-links {
                display: none;
            }
            
            .device-mobile .hero {
                min-height: 400px;
            }
            
            .touch-device .product-card:hover {
                transform: none;
            }
            
            .touch-device .product-card:active {
                transform: scale(0.98);
                transition: transform 0.1s;
            }
            
            /* Header con scroll en móvil */
            .device-mobile header.scrolled {
                padding: 0.5rem 0;
                backdrop-filter: blur(10px);
                background: rgba(139, 69, 19, 0.95);
            }
            
            .device-mobile header.scrolled .logo {
                font-size: 1.4rem;
            }
            
            /* Orientaciones específicas */
            .mobile-landscape .hero {
                height: 70vh !important;
            }
            
            .mobile-landscape .product-grid {
                grid-template-columns: repeat(3, 1fr) !important;
            }
            
            /* Variables CSS dinámicas */
            :root {
                --vh: 1vh;
                --vw: 1vw;
            }
            
            /* Altura real de viewport para móviles */
            .full-height {
                height: calc(var(--vh, 1vh) * 100);
            }
            
            /* Breakpoints específicos */
            .bp-xs .section { padding: 1rem 0.75rem; }
            .bp-sm .section { padding: 2rem 1rem; }
            .bp-md .section { padding: 3rem 1.5rem; }
            .bp-lg .section { padding: 4rem 2rem; }
            .bp-xl .section { padding: 5rem 2rem; }
        `;
        document.head.appendChild(style);
    }
};

// Inicializar estilos dinámicos
addResponsiveStyles();