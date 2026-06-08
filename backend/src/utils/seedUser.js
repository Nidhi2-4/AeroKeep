const prisma = require('../prisma')

// Starter inventory every new operator receives on signup.
// (This is the data that used to be hardcoded as MOCK_PRODUCTS in the frontend.)
const SEED = [
  { category: 'Avionics',       name: 'Flight Controller X7',      sku: 'AVI-FC-007',  price: 12500,  quantity: 15, lowStockThreshold: 5,  serialNumber: null,            manufacturer: 'Holybro' },
  { category: 'Power Systems',  name: 'BMS Intelligent LiPo Pack', sku: 'PWR-BMS-001', price: 8900,   quantity: 3,  lowStockThreshold: 5,  serialNumber: null,            manufacturer: 'Tattu' },
  { category: 'Avionics',       name: 'GPS Module NEO-9',          sku: 'AVI-GPS-009', price: 4200,   quantity: 2,  lowStockThreshold: 5,  serialNumber: null,            manufacturer: 'u-blox' },
  { category: 'Power Systems',  name: 'ESC 40A Pro',               sku: 'PWR-ESC-040', price: 3100,   quantity: 28, lowStockThreshold: 10, serialNumber: null,            manufacturer: 'BLHeli' },
  { category: 'Structure',      name: 'Carbon Frame X500',         sku: 'STR-CF-500',  price: 15000,  quantity: 8,  lowStockThreshold: 3,  serialNumber: 'CF-500-001',    manufacturer: 'BeRAM' },
  { category: 'Communications', name: 'Telemetry Radio 915MHz',    sku: 'COM-TLM-915', price: 5600,   quantity: 0,  lowStockThreshold: 4,  serialNumber: null,            manufacturer: 'RFD' },
  { category: 'Finished UAVs',  name: 'Precision UAV Alpha-7',     sku: 'UAV-ALP-007', price: 285000, quantity: 2,  lowStockThreshold: 1,  serialNumber: 'ALP-007-SN001', manufacturer: 'BeRAM' },
]

// Creates starter categories + products (+ an initial stock movement) for ONE user.
// All rows are tagged with this user's id, so the data is private to that account.
//
// NOTE: intentionally NOT wrapped in prisma.$transaction(). Interactive transactions
// require a single pinned connection, which the Supabase pooled (PgBouncer) connection
// can't provide — that caused the seed to silently fail in production. Sequential
// creates work fine over the pooler. A brand-new user has no existing rows, so there's
// nothing to conflict with and atomicity isn't needed here.
async function seedUserInventory(userId) {
  const categoryNames = [...new Set(SEED.map((s) => s.category))]

  // 1) Categories — keep a name -> id map for linking products.
  const catMap = {}
  for (const name of categoryNames) {
    const cat = await prisma.category.create({ data: { name, userId } })
    catMap[name] = cat.id
  }

  // 2) Products + an initial "IN" stock movement for each.
  for (const s of SEED) {
    const product = await prisma.product.create({
      data: {
        name: s.name,
        sku: s.sku,
        categoryId: catMap[s.category],
        userId,
        price: s.price,
        quantity: s.quantity,
        lowStockThreshold: s.lowStockThreshold,
        serialNumber: s.serialNumber,
        manufacturer: s.manufacturer,
      },
    })
    if (s.quantity > 0) {
      await prisma.stockMovement.create({
        data: { productId: product.id, type: 'IN', quantity: s.quantity, reason: 'Initial stock', userId },
      })
    }
  }
}

module.exports = { seedUserInventory }