// Base de datos de productos mejorada
const products = [
    // Chocolates
    {
        id: 1,
        name: "Chocolate Clasico",
        category: "chocolates",
        price: 28.99,
        description: "Chocolate premium con almendras tostadas",
        image: "imagenes/Chocolates/2.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 89
    },
    {
        id: 2,
        name: "Chocolate con Almendras",
        category: "chocolates",
        price: 18.99,
        description: "Chocolate premium con almendras tostadas",
        image: "imagenes/chocolates/6.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 89
    },
    {
        id: 3,
        name: "Chocolate Blanco",
        category: "chocolates",
        price: 16.99,
        description: "Suave chocolate blanco con vainilla natural",
        image: "imagenes/chocolates/7.jpeg",
        inStock: true,
        rating: 4.4,
        reviews: 156
    },
    {
        id: 4,
        name: "Choco y cerveza",
        category: "chocolates",
        price: 25.99,
        description: "Rico chocolate y cerveza",
        image: "imagenes/Chocolates/14.jpeg",
        inStock: true,
        rating: 4.7,
        reviews: 78
    },
    // Flores
    {
        id: 5,
        name: "Rosas Rojas",
        category: "flores",
        price: 25.99,
        description: "Hermoso ramo de 12 rosas rojas frescas",
        image: "imagenes/flores/1.jpeg",
        inStock: true,
        rating: 4.7,
        reviews: 78
    },
    {
        id: 6,
        name: "Girasoles",
        category: "flores",
        price: 19.99,
        description: "Arreglo de girasoles alegres y vibrantes",
        image: "imagenes/flores/2.jpeg",
        inStock: true,
        rating: 4.5,
        reviews: 64
    },
    {
        id: 7,
        name: "Flores Mixtas",
        category: "flores",
        price: 28.99,
        description: "Arreglado variado con flores",
        image: "imagenes/Flores/1.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 92
    },
    {
        id: 8,
        name: "Tulipanes",
        category: "flores",
        price: 21.99,
        description: "Elegantes tulipanes en colores variados",
        image: "imagenes/flores/4.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 47
    },
    // Otros
    {
        id: 9,
        name: "Vino Tinto Premium",
        category: "otros",
        price: 45.99,
        description: "Vino tinto de reserva especial",
        image: "imagenes/otros/vino1.jpeg",
        inStock: true,
        rating: 4.7,
        reviews: 134
    },
    {
        id: 10,
        name: "Vino Blanco",
        category: "otros",
        price: 38.99,
        description: "Vino blanco fresco y afrutado",
        image: "imagenes/otros/vino2.jpeg",
        inStock: true,
        rating: 4.5,
        reviews: 98
    },
    {
        id: 11,
        name: "Vino Rosé",
        category: "otros",
        price: 38.99,
        description: "Vino rosé elegante y refrescante",
        image: "imagenes/otros/vino7.jpeg",
        inStock: true,
        rating: 4.4,
        reviews: 76
    },
    {
        id: 12,
        name: "Mariachi Clasico",
        category: "otros",
        price: 58.99,
        description: "Grupo de mariachis",
        image: "imagenes/otros/mariachi1.jpeg",
        inStock: true,
        rating: 4.4,
        reviews: 76
    },
    {
        id: 13,
        name: "Mariachi Romantico",
        category: "otros",
        price: 88.99,
        description: "Canciones romanticas personalizadas",
        image: "imagenes/otros/mariachi2.jpeg",
        inStock: true,
        rating: 4.4,
        reviews: 96
    },
        {
        id: 14,
        name: "Mariachi loco",
        category: "otros",
        price: 68.99,
        description: "Canciones romanticas a tu gusto",
        image: "imagenes/otros/mariachi3.jpeg",
        inStock: true,
        rating: 5.4,
        reviews: 76
    },
        {
        id: 15,
        name: "Mariachi Dia de los muertos ",
        category: "otros",
        price: 88.99,
        description: "Canciones melodicas para momentos tristes",
        image: "imagenes/otros/mariachi4.jpeg",
        inStock: true,
        rating: 4.4,
        reviews: 96
    },
        {
        id: 16,
        name: "Mariachi Lucido",
        category: "otros",
        price: 78.99,
        description: "Canciones mexicanas",
        image: "imagenes/otros/mariachi5.jpeg",
        inStock: true,
        rating: 3.4,
        reviews: 76
    }
];

// Configuración de la aplicación
const CONFIG = {
    STORAGE_KEYS: {
        CART: 'dulceAroma_cart',
        FAVORITES: 'dulceAroma_favorites',
        USER_PREFERENCES: 'dulceAroma_preferences'
    },
    NOTIFICATION_DURATION: 3000,
    IMAGE_LOADING_TIMEOUT: 5000,
    PAYMENT_METHODS: [
        { id: 'tarjeta', name: 'Tarjeta', icon: 'fas fa-credit-card' },
        { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
        { id: 'efectivo', name: 'Efectivo', icon: 'fas fa-money-bill-wave' }
    ]
};

// Categorías de productos
const CATEGORIES = {
    all: 'Todos',
    chocolates: 'Chocolates',
    flores: 'Flores',
    otros: 'Otros'
};

// Emojis por categoría para fallback de imágenes
const CATEGORY_EMOJIS = {
    chocolates: '🍫',
    flores: '🌸',
    otros: '🍷'
};