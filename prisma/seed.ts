import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with expanded catalog...')

  // ── 1. Categories ───────────────────────────────────────
  const categories = [
    { name: 'Clothing', slug: 'clothing', description: 'Premium fashion and apparel', sortOrder: 1, image: '/products/cat-clothing.png' },
    { name: 'Accessories', slug: 'accessories', description: 'Curated accessories and wearables', sortOrder: 2, image: '/products/cat-accessories.png' },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle products for the modern aesthete', sortOrder: 3, image: '/products/cat-lifestyle.png' },
    { name: 'Footwear', slug: 'footwear', description: 'Crafted shoes and sneakers', sortOrder: 4, image: '/products/cat-footwear.png' },
    { name: 'Outerwear', slug: 'outerwear', description: 'Jackets, coats, and protective layers', sortOrder: 5, image: '/products/cat-outerwear.png' },
    { name: 'Homeware', slug: 'homeware', description: 'Artisan homeware and living essentials', sortOrder: 6, image: '/products/cat-homeware.png' },
    { name: 'Art Prints', slug: 'art-prints', description: 'Curated graphic prints and posters', sortOrder: 7, image: '/products/cat-artprints.png' },
    { name: 'Grooming', slug: 'grooming', description: 'Premium self-care and fragrances', sortOrder: 8, image: '/products/cat-grooming.png' },
    { name: 'Bags & Backpacks', slug: 'bags', description: 'Functional carrying goods', sortOrder: 9, image: '/products/cat-bags.png' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: cat.image, description: cat.description },
      create: cat,
    })
  }

  // ── 2. Tags ─────────────────────────────────────────────
  const tags = [
    { name: 'New Arrival', slug: 'new-arrival', color: '#C8A96E' },
    { name: 'Best Seller', slug: 'best-seller', color: '#4CAF7D' },
    { name: 'Sale', slug: 'sale', color: '#E05252' },
    { name: 'Limited Edition', slug: 'limited-edition', color: '#5B8DEF' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  const getCat = async (slug: string) => await prisma.category.findUnique({ where: { slug } }).then(c => c!.id)
  const getTag = async (slug: string) => await prisma.tag.findUnique({ where: { slug } }).then(t => t!.id)

  const catClothing = await getCat('clothing')
  const catAccessories = await getCat('accessories')
  const catLifestyle = await getCat('lifestyle')
  const catFootwear = await getCat('footwear')
  const catOuterwear = await getCat('outerwear')
  const catHomeware = await getCat('homeware')
  const catArt = await getCat('art-prints')
  const catGrooming = await getCat('grooming')
  const catBags = await getCat('bags')

  const tagNew = await getTag('new-arrival')
  const tagBest = await getTag('best-seller')
  const tagSale = await getTag('sale')
  const tagLimited = await getTag('limited-edition')

  // Set paths to locally generated AI product imagery
  const img = (category: string) => `/products/${category}.png`

  // ── 3. Sample Products (5 per Category = 45 Products) ─────────────────────────
  const sampleProducts = [
    /* 1. CLOTHING */
    { name: 'Gravity Tee — Obsidian', slug: 'gravity-tee-obsidian', price: 485000, stock: 45, categoryId: catClothing, image: img('clothing'), tagIds: [tagBest] },
    { name: 'Gravity Tee — Bone', slug: 'gravity-tee-bone', price: 485000, stock: 32, categoryId: catClothing, image: '/products/clothing_gravity_bone_1775784454092.png', tagIds: [] },
    { name: 'Drift Overshirt — Sand', slug: 'drift-overshirt-sand', price: 895000, stock: 8, categoryId: catClothing, image: '/products/clothing_drift_overshirt_1775784470328.png', tagIds: [tagSale] },
    { name: 'Linen Lounge Pants — Navy', slug: 'linen-lounge-pants-navy', price: 650000, stock: 24, categoryId: catClothing, image: '/products/clothing_linen_pants_1775784486125.png', tagIds: [] },
    { name: 'Merino Wool Turtleneck', slug: 'merino-turtleneck', price: 1150000, stock: 12, categoryId: catClothing, image: '/products/clothing_merino_turtleneck_1775784503745.png', tagIds: [tagNew] },

    /* 2. ACCESSORIES */
    { name: 'Orbital Leather Watch Strap', slug: 'orbital-strap', price: 350000, stock: 34, categoryId: catAccessories, image: img('accessories'), tagIds: [tagBest] },
    { name: 'Minimalist Cardholder — Tan', slug: 'minimalist-cardholder-tan', price: 450000, stock: 12, categoryId: catAccessories, image: '/products/accessories_cardholder_1775784520482.png', tagIds: [tagSale] },
    { name: 'Titanium Carabiner', slug: 'titanium-carabiner', price: 250000, stock: 68, categoryId: catAccessories, image: '/products/accessories_carabiner_1775784536882.png', tagIds: [] },
    { name: 'Acetate Sunglasses — Tortoise', slug: 'acetate-sunglasses', price: 1250000, stock: 15, categoryId: catAccessories, image: '/products/accessories_sunglasses_1775784551219.png', tagIds: [tagLimited] },
    { name: 'Sterling Silver Cuff', slug: 'silver-cuff', price: 1850000, stock: 8, categoryId: catAccessories, image: '/products/accessories_silver_cuff_1775784568488.png', tagIds: [tagNew] },

    /* 3. LIFESTYLE */
    { name: 'Field Notebook — Linen Cover', slug: 'field-notebook', price: 195000, stock: 62, categoryId: catLifestyle, image: '/products/lifestyle-1.png', tagIds: [tagBest] },
    { name: 'Brass Pen — Machined', slug: 'brass-pen', price: 420000, stock: 45, categoryId: catLifestyle, image: '/products/lifestyle-2.png', tagIds: [] },
    { name: 'Leather Desk Mat', slug: 'leather-desk-mat', price: 950000, stock: 20, categoryId: catLifestyle, image: '/products/lifestyle-3.png', tagIds: [tagSale] },
    { name: 'Aluminium Water Flask', slug: 'water-flask', price: 350000, stock: 110, categoryId: catLifestyle, image: '/products/lifestyle-4.png', tagIds: [] },
    { name: 'Incense Holder — Concrete', slug: 'incense-holder', price: 150000, stock: 85, categoryId: catLifestyle, image: img('lifestyle'), tagIds: [tagNew] },

    /* 4. FOOTWEAR */
    { name: 'Monolith Leather Sneakers', slug: 'monolith-sneakers', price: 2450000, stock: 10, categoryId: catFootwear, image: '/products/footwear-1.png', tagIds: [tagBest] },
    { name: 'Suede Chelsea Boots', slug: 'suede-chelsea-boots', price: 2800000, stock: 0, categoryId: catFootwear, image: '/products/footwear-2.png', tagIds: [tagSale] },
    { name: 'Canvas Slip-on', slug: 'canvas-slip-on', price: 850000, stock: 42, categoryId: catFootwear, image: '/products/footwear-3.png', tagIds: [] },
    { name: 'Chunky Loafers — Black', slug: 'chunky-loafers', price: 2150000, stock: 23, categoryId: catFootwear, image: '/products/footwear-4.png', tagIds: [tagNew] },
    { name: 'Desert Boots — Sand', slug: 'desert-boots', price: 1950000, stock: 17, categoryId: catFootwear, image: img('footwear'), tagIds: [] },

    /* 5. OUTERWEAR */
    { name: 'Technical Shell Jacket', slug: 'technical-shell', price: 1550000, stock: 18, categoryId: catOuterwear, image: '/products/outerwear-1.png', tagIds: [tagNew] },
    { name: 'Waxed Cotton Raincoat', slug: 'waxed-raincoat', price: 2850000, stock: 12, categoryId: catOuterwear, image: '/products/outerwear-2.png', tagIds: [tagLimited] },
    { name: 'Oversized Trench Coat', slug: 'trench-coat', price: 3200000, stock: 5, categoryId: catOuterwear, image: '/products/outerwear-3.png', tagIds: [] },
    { name: 'Fleece Vest — Olive', slug: 'fleece-vest', price: 850000, stock: 38, categoryId: catOuterwear, image: '/products/outerwear-4.png', tagIds: [tagSale] },
    { name: 'Heavy Denim Jacket', slug: 'denim-jacket', price: 1450000, stock: 26, categoryId: catOuterwear, image: img('outerwear'), tagIds: [tagBest] },

    /* 6. HOMEWARE */
    { name: 'Ceramic Pour-Over Set', slug: 'ceramic-pour-over', price: 1200000, stock: 15, categoryId: catHomeware, image: '/products/homeware-1.png', tagIds: [tagSale] },
    { name: 'Linen Throw Blanket', slug: 'linen-throw', price: 850000, stock: 22, categoryId: catHomeware, image: '/products/homeware-2.png', tagIds: [] },
    { name: 'Stoneware Mug Set (x2)', slug: 'stoneware-mugs', price: 450000, stock: 55, categoryId: catHomeware, image: '/products/homeware-3.png', tagIds: [tagBest] },
    { name: 'Brass Candle Snuffer', slug: 'candle-snuffer', price: 1850000, stock: 14, categoryId: catHomeware, image: '/products/homeware-4.png', tagIds: [tagLimited] },
    { name: 'Handblown Glass Carafe', slug: 'glass-carafe', price: 650000, stock: 30, categoryId: catHomeware, image: img('homeware'), tagIds: [tagNew] },

    /* 7. ART PRINTS */
    { name: 'Abstract Form 01', slug: 'abstract-form-01', price: 850000, stock: 20, categoryId: catArt, image: '/products/art-1.png', tagIds: [tagLimited] },
    { name: 'Monochrome Typography Poster', slug: 'typography-poster', price: 450000, stock: 50, categoryId: catArt, image: '/products/art-2.png', tagIds: [] },
    { name: 'Brutalist Architecture Print', slug: 'brutalist-print', price: 650000, stock: 25, categoryId: catArt, image: '/products/art-3.png', tagIds: [tagBest] },
    { name: 'Botanical Illustration', slug: 'botanical-print', price: 550000, stock: 40, categoryId: catArt, image: '/products/art-4.png', tagIds: [tagSale] },
    { name: 'Minimalist Line Art', slug: 'line-art-print', price: 500000, stock: 35, categoryId: catArt, image: img('art'), tagIds: [tagNew] },

    /* 8. GROOMING */
    { name: 'Signature Eau de Parfum', slug: 'signature-edp', price: 1100000, stock: 3, categoryId: catGrooming, image: '/products/grooming-1.png', tagIds: [tagBest] },
    { name: 'Cedar & Smoke Soy Candle', slug: 'soy-candle-cedar', price: 320000, stock: 40, categoryId: catGrooming, image: '/products/grooming-2.png', tagIds: [] },
    { name: 'Sea Salt Texturizing Spray', slug: 'sea-salt-spray', price: 240000, stock: 65, categoryId: catGrooming, image: '/products/grooming-3.png', tagIds: [tagSale] },
    { name: 'Charcoal Face Wash', slug: 'charcoal-face-wash', price: 210000, stock: 75, categoryId: catGrooming, image: '/products/grooming-4.png', tagIds: [] },
    { name: 'Matte Hair Pomade', slug: 'hair-pomade', price: 180000, stock: 55, categoryId: catGrooming, image: img('grooming'), tagIds: [tagNew] },

    /* 9. BAGS & BACKPACKS */
    { name: 'Canvas Weekender Duffel', slug: 'canvas-weekender', price: 1850000, stock: 5, categoryId: catBags, image: '/products/bags-1.png', tagIds: [tagLimited] },
    { name: 'Rolltop City Backpack', slug: 'rolltop-backpack', price: 1450000, stock: 28, categoryId: catBags, image: '/products/bags-2.png', tagIds: [tagBest] },
    { name: 'Leather Crossbody Sling', slug: 'leather-sling', price: 950000, stock: 42, categoryId: catBags, image: '/products/bags-3.png', tagIds: [tagSale] },
    { name: 'Nylon Tote Bag', slug: 'nylon-tote', price: 550000, stock: 80, categoryId: catBags, image: '/products/bags-4.png', tagIds: [] },
    { name: 'Tech Organizer Pouch', slug: 'tech-pouch', price: 450000, stock: 65, categoryId: catBags, image: img('bags'), tagIds: [tagNew] },
  ]

  // Clear existing items and inject all at once for a fresh start
  await prisma.productCategory.deleteMany({})
  await prisma.productTag.deleteMany({})
  await prisma.productImage.deleteMany({})
  await prisma.product.deleteMany({})

  for (const product of sampleProducts) {
    const { categoryId, tagIds, image, ...productData } = product
    await prisma.product.create({
      data: {
        ...productData,
        description: `<p>Elevate your everyday with the ${productData.name}. Meticulously crafted for the highest quality standard.</p>`,
        status: 'ACTIVE',
        publishedAt: new Date(),
        totalSold: Math.floor(Math.random() * 500),
        averageRating: 4 + Math.random(),
        totalReviews: Math.floor(Math.random() * 200),
        images: {
          create: [{ url: image, publicId: product.slug + '-1', alt: product.name, sortOrder: 0 }],
        },
        categories: {
          create: [{ categoryId }],
        },
        tags: {
          create: tagIds.map(tagId => ({ tagId })),
        },
      },
    })
  }

  console.log('✅ Created 45 Products seamlessly across 9 categories!')

  // ── 4. Banner ────────────────────────────────────
  const existingBanners = await prisma.banner.count()
  if (existingBanners === 0) {
    await prisma.banner.create({
      data: {
        title: 'New Essentials',
        subtitle: 'Everything you need, nothing you don’t.',
        ctaText: 'Shop the Collection',
        ctaLink: '/shop',
        imageDesktop: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
        isActive: true,
        sortOrder: 1,
      },
    })
  }

  console.log('\\n🚀 Large Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
