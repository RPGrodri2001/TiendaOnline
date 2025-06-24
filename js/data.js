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
        name: "Chocolate de corazones",
        category: "chocolates",
        price: 43.99,
        description: "Variedad de chocolates con diseños de corazon",
        image: "imagenes/Chocolates/chocolate1.jpeg",
        inStock: true,
        rating: 5,
        reviews: 79
    },
    {
        id: 3,
        name: "Canasta Chocolatero ",
        category: "chocolates",
        price: 50.99,
        description: "Canasta decorada con Oso y chocolates Ferreros",
        image: "imagenes/Chocolates/3.jpeg",
        inStock: true,
        rating: 5,
        reviews: 99
    },
    {
        id: 4,
        name: "Caja de Chocolate Circular",
        category: "chocolates",
        price: 70.99,
        description: "Multiples chocolates en una arreglo personalizado",
        image: "imagenes/Chocolates/4.jpeg",
        inStock: true,
        rating: 4.9,
        reviews: 109
    },
    {
        id: 5,
        name: "Mickey Chocolate",
        category: "chocolates",
        price: 71.99,
        description: "Chocolates en caja personalizada de Mickey Mouse",
        image: "imagenes/Chocolates/5.jpeg",
        inStock: true,
        rating: 4.4,
        reviews: 79
    },
    {
        id: 6,
        name: "Choco Cakes",
        category: "chocolates",
        price: 23.99,
        description: "Cakes de chocolates en forma de corazón , personalizados",
        image: "imagenes/Chocolates/6.jpeg",
        inStock: true,
        rating: 2.6,
        reviews: 43
    },
    {
        id: 7,
        name: "Fresas con chocolate y Cerveza",
        category: "chocolates",
        price: 19.99,
        description: "Chocolates personalizados para el dia del padre",
        image: "/imagenes/Chocolates/7.jpeg",
        inStock: true,
        rating: 3.6,
        reviews: 53
    },
    {
        id: 8,
        name: "Ramo de fresas con Chocolate ❤ ",
        category: "chocolates",
        price: 53.99,
        description: "40 Chcolates en un ramo personaliazdo",
        image: "imagenes/Chocolates/8.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 83
    },
    {
        id: 9,
        name: "Choco I Love YOU ",
        category: "chocolates",
        price: 48.99,
        description: "Caja personalizada con letras de I❤U con choco fresas por dentro",
        image: "imagenes/Chocolates/9.jpeg",
        inStock: true,
        rating: 3.6,
        reviews: 63
    },
    {
        id: 10,
        name: "Ramo Ferrero Rocher ",
        category: "chocolates",
        price: 69.99,
        description: "Ramo personalizado de Chocolates premium Ferreros Rochers",
        image: "imagenes/Chocolates/10.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 87
    },
    {
        id: 11,
        name: "Corazon Surtido ",
        category: "chocolates",
        price: 28.99,
        description: "Caja de corazon con flores y dulces surtidos personalizado",
        image: "imagenes/Chocolates/11.jpeg",
        inStock: true,
        rating: 2.6,
        reviews: 65
    },
    {
        id: 12,
        name: "Choco graduado",
        category: "chocolates",
        price: 43.99,
        description: "Caja personalizada para eventos de graduaciones, relleno de chocolates",
        image: "imagenes/Chocolates/12.jpeg",
        inStock: true,
        rating: 3.6,
        reviews: 53
    },
    {
        id: 13,
        name: "Choco Corbata",
        category: "chocolates",
        price: 15.99,
        description: "Caja de corbata personalizada para el papa, con chocolates surtidos por dentro",
        image: "imagenes/Chocolates/13.jpeg",
        inStock: true,
        rating: 4.1,
        reviews: 41
    },
    {
        id: 14,
        name: "Choco Cheve",
        category: "chocolates",
        price: 13.99,
        description: "Cakes de chocolates personalizados con una cerveza",
        image: "imagenes/Chocolates/14.jpeg",
        inStock: true,
        rating: 2.6,
        reviews: 33
    },
    {
        id: 15,
        name: "Choco Dulces surtidos",
        category: "chocolates",
        price: 20.99,
        description: "Cakes circular personalizadas , con dulces surtidos de preferencia",
        image: "imagenes/Chocolates/15.jpeg",
        inStock: true,
        rating: 3.6,
        reviews: 37
    },
    {
        id: 16,
        name: "Choco Heart",
        category: "chocolates",
        price: 45.99,
        description: "Caja de corazon personalizada, con tus dulces favoritos",
        image: "imagenes/Chocolates/16.jpeg",
        inStock: true,
        rating: 4.7,
        reviews: 78
    },
    {
        id: 17,
        name: "Candy Ramo",
        category: "chocolates",
        price: 21.99,
        description: "Ramo de dulces personalizado",
        image: "imagenes/Chocolates/17.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 45
    },
    {
        id: 18,
        name: "Choco Full",
        category: "chocolates",
        price: 45.99,
        description: "Caja personalizada, con relleno de multiples chocolates + oso personal",
        image: "imagenes/Chocolates/18.jpeg",
        inStock: true,
        rating: 5,
        reviews: 67
    },
    {
        id: 19,
        name: "Choco tarta",
        category: "chocolates",
        price: 32.99,
        description: "Arreglo personalizado con diferentes sabores de cakes de chocolate",
        image: "imagenes/Chocolates/19.jpeg",
        inStock: true,
        rating: 3.5,
        reviews: 60
    },
    {
        id: 20,
        name: "Fresas Chocolatadas",
        category: "chocolates",
        price: 50.99,
        description: "24 Fresas con chocolates, con diseño personalizado",
        image: "imagenes/Chocolates/20.jpeg",
        inStock: true,
        rating: 5,
        reviews: 78
    },


    // Flores
    {
        id: 21,
        name: "Girasoles con base personalizada",
        category: "flores",
        price: 43.99,
        description: "Arreglo de girasoles con base personalizada",
        image: "imagenes/Flores/1.jpeg",
        inStock: true,
        rating: 5,
        reviews: 92
    },
    {
        id: 22,
        name: "Flores Blancas",
        category: "flores",
        price: 30.99,
        description: "Ramo de flores blancas variadoss",
        image: "imagenes/Flores/2.jpeg",
        inStock: true,
        rating: 4.1,
        reviews: 52
    },
    {
        id: 23,
        name: "Flores de Cumpleaños",
        category: "flores",
        price: 48.99,
        description: "Arreglado variado de flores con globo de cumpleaños",
        image: "imagenes/Flores/3.jpeg",
        inStock: true,
        rating: 3.1,
        reviews: 76
    },
    {
        id: 24,
        name: "Rosas rojas y fucsias",
        category: "flores",
        price: 34.99,
        description: "Elegantes rosas en colores variados sutiles",
        image: "/imagenes/Flores/4.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 53
    },

    {
        id: 25,
        name: "Buque Rosado",
        category: "flores",
        price: 31.99,
        description: "Elegantes Buque de rosas rosas",
        image: "/imagenes/Flores/5.jpeg",
        inStock: true,
        rating: 4.2,
        reviews: 65
    },
    {
        id: 26,
        name: "Multiples rosas y girasoles",
        category: "flores",
        price: 40.99,
        description: "Buque personalizado para cumpleaños de rosas y girasoles",
        image: "/imagenes/Flores/6.jpeg",
        inStock: true,
        rating: 2.6,
        reviews: 73
    },
    {
        id: 27,
        name: "Rosas heart",
        category: "flores",
        price: 85.99,
        description: "Rosas rojas en forma de corazón personalizado",
        image: "/imagenes/Flores/7.jpeg",
        inStock: true,
        rating: 5,
        reviews: 95
    },
    {
        id: 28,
        name: "Tulipanes",
        category: "flores",
        price: 52.99,
        description: "Elegante arreglo de tulipanes especiales",
        image: "/imagenes/Flores/8.jpeg",
        inStock: true,
        rating: 3.6,
        reviews: 68
    },
    {
        id: 29,
        name: "Buque de Corazon",
        category: "flores",
        price: 53.99,
        description: "Arreglo personalizado de rosas en forma de corazón para eventos especiales",
        image: "/imagenes/Flores/9.jpeg",
        inStock: true,
        rating: 4.8,
        reviews: 53
    },
    {
        id: 30,
        name: "Ramo sencillo Roas",
        category: "flores",
        price: 20.99,
        description: "Arreglo de ramo de rosas sencillo pero dedicar ",
        image: "/imagenes/Flores/10.jpeg",
        inStock: true,
        rating: 2.6,
        reviews: 41
    },
        {
        id: 31,
        name: "Buque sencillo",
        category: "flores",
        price: 20.99,
        description: "Arreglo sencillo pero delicado con rosas rosadas",
        image: "/imagenes/Flores/11.jpeg",
        inStock: true,
        rating: 3.6,
        reviews: 41
    },
        {
        id: 32,
        name: "Buque Rojo",
        category: "flores",
        price: 65.99,
        description: "Elegantes rosas solo en color Rojo",
        image: "/imagenes/Flores/12.jpeg",
        inStock: true,
        rating: 5,
        reviews: 90
    },
        {
        id: 33,
        name: "Rosas express",
        category: "flores",
        price: 25.99,
        description: "Adecuado para regalos momentaneos y lindos",
        image: "/imagenes/Flores/13.jpeg",
        inStock: true,
        rating: 4.6,
        reviews: 25
    },
        {
        id: 34,
        name: "Canasta amorosa",
        category: "flores",
        price: 76.99,
        description: "Canasta personalizada con múltiples rosas",
        image: "/imagenes/Flores/14.jpeg",
        inStock: true,
        rating: 5,
        reviews: 93
    },
        {
        id: 35,
        name: "Buque pequeño",
        category: "flores",
        price: 38.99,
        description: "Arreglo de rosas Rojas y fucsias en su buque personalizado",
        image: "/imagenes/Flores/15.jpeg",
        inStock: true,
        rating: 4.7,
        reviews: 59
    },

    // Otros
        // Apartado de vinos
    {
        id: 36,
        name: "Vino Hannetot,  Premium",
        category: "otros",
        price: 45.99,
        description: "Vino Hannetot, tinto de reserva especial",
        image: "imagenes/otros/vino1.jpeg",
        inStock: true,
        rating: 4.7,
        reviews: 134
    },
    {
        id: 37,
        name: "Vino Rojo 50 Anniverssario",
        category: "otros",
        price: 38.99,
        description: "Vino Rojo fresco y afrutado",
        image: "imagenes/otros/vino2.jpeg",
        inStock: true,
        rating: 4.5,
        reviews: 98
    },
    {
        id: 38,
        name: "Vino Savalan",
        category: "otros",
        price: 38.99,
        description: "Vino Savalan elegante y refrescante",
        image: "imagenes/otros/vino3.jpeg",
        inStock: true,
        rating: 5,
        reviews: 76
    },
        {
        id: 39,
        name: "Vino Stella Rosa",
        category: "otros",
        price: 38.99,
        description: "Vino Rosa, dulce",
        image: "imagenes/otros/vino4.jpeg",
        inStock: true,
        rating: 4,
        reviews: 56
    },
        {
        id: 40,
        name: "Vino Casillero del Diablo",
        category: "otros",
        price: 28.99,
        description: "Vino Elegante y bien fermentado",
        image: "imagenes/otros/vino5.jpeg",
        inStock: true,
        rating: 4.8,
        reviews: 84
    },
        {
        id: 41,
        name: "Vino Nero ",
        category: "otros",
        price: 45.99,
        description: "Vino Tinto de Sicilia, elegante y suave",
        image: "imagenes/otros/vino6.jpeg",
        inStock: true,
        rating: 5,
        reviews: 90
    },
        {
        id: 42,
        name: "Vino Ornellaia",
        category: "otros",
        price: 40.99,
        description: "Vino tinto premium",
        image: "imagenes/otros/vino7.jpeg",
        inStock: true,
        rating: 4.2,
        reviews: 76
    },
        // Apartado mariachis
    {
        id: 43,
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
        id: 44,
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
        id: 45,
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
        id: 46,
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
        id: 47,
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