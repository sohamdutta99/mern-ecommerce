/**
 * seed.js — Database Seeder
 * Run: node seed.js
 * Clears existing products and seeds 10 realistic products across 4 categories.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  // ─── Electronics ───────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Industry-leading noise canceling headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours battery life. Premium design with ultra-comfortable ear pads for all-day listening.',
    price: 349.99,
    category: 'Electronics',
    brand: 'Sony',
    stock: 45,
    rating: 4.8,
    numReviews: 2341,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    name: 'Apple MacBook Air M3',
    description:
      'Supercharged by the M3 chip, MacBook Air features a stunning Liquid Retina display, up to 18 hours of battery life, and a fanless design that runs completely silent. Available in 13-inch and 15-inch models.',
    price: 1299.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 20,
    rating: 4.9,
    numReviews: 876,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  },
  {
    name: 'Samsung 65" QLED 4K Smart TV',
    description:
      'Quantum Dot technology delivers over a billion shades of brilliant color. With Neo QLED technology, Quantum HDR, and a sleek AirSlim design, this TV transforms your living room into a cinematic experience.',
    price: 899.99,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 15,
    rating: 4.6,
    numReviews: 1203,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80',
  },
  {
    name: 'GoPro HERO12 Black',
    description:
      'The most powerful GoPro ever with HyperSmooth 6.0, 5.3K60 video, 27MP photos, and 2x improved low-light performance. Waterproof to 33ft without a housing. Capture every adventure in stunning detail.',
    price: 399.99,
    category: 'Electronics',
    brand: 'GoPro',
    stock: 30,
    rating: 4.7,
    numReviews: 567,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
  },

  // ─── Clothing ──────────────────────────────────────────────────
  {
    name: "Levi's 501 Original Fit Jeans",
    description:
      'The original straight fit, button fly jeans that started it all. Made with 100% cotton heavyweight denim, these iconic jeans get better with every wash and are built to last a lifetime.',
    price: 69.99,
    category: 'Clothing',
    brand: "Levi's",
    stock: 120,
    rating: 4.5,
    numReviews: 4567,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
  },
  {
    name: 'Nike Air Max 270 Sneakers',
    description:
      'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for an extremely cushioned feel. The mesh upper is lightweight and breathable, making it perfect for all-day wear and light athletic activities.',
    price: 150.00,
    category: 'Clothing',
    brand: 'Nike',
    stock: 80,
    rating: 4.6,
    numReviews: 3210,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },

  // ─── Kitchen ───────────────────────────────────────────────────
  {
    name: 'Ninja Professional Blender',
    description:
      '1000-watt motor with XL 72 oz. total crushing pitcher. Crush ice, whole fruits, and vegetables in seconds. Dishwasher-safe parts and BPA-free materials. Perfect for smoothies, soups, and frozen drinks.',
    price: 89.99,
    category: 'Kitchen',
    brand: 'Ninja',
    stock: 55,
    rating: 4.4,
    numReviews: 2987,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description:
      'Replace 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6-quart capacity, 14 smart programs, and easy-seal lid for worry-free cooking.',
    price: 99.99,
    category: 'Kitchen',
    brand: 'Instant Pot',
    stock: 40,
    rating: 4.7,
    numReviews: 8901,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },

  // ─── Books ─────────────────────────────────────────────────────
  {
    name: 'Clean Code by Robert C. Martin',
    description:
      'A handbook of agile software craftsmanship. Packed with real-world examples and best practices, this book teaches you how to write code that not only works but is clean, readable, and maintainable.',
    price: 34.99,
    category: 'Books',
    brand: 'Prentice Hall',
    stock: 200,
    rating: 4.8,
    numReviews: 12456,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  },
  {
    name: 'Atomic Habits by James Clear',
    description:
      'The #1 New York Times bestseller. An easy and proven way to build good habits and break bad ones. James Clear reveals practical strategies that will teach you exactly how to form good habits and eliminate bad ones.',
    price: 27.99,
    category: 'Books',
    brand: 'Avery Publishing',
    stock: 300,
    rating: 4.9,
    numReviews: 34789,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Products cleared');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products seeded successfully!`);

    console.log('\n📦 Seeded Products:');
    createdProducts.forEach((p) => {
      console.log(`  - [${p.category}] ${p.name} — $${p.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
