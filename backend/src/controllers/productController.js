const prisma = require('../prisma')

exports.getAll = async (req, res) => {
  try {
    const { search, categoryId, stockStatus } = req.query
    const where = { userId: req.user.id } // only this user's products
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } }
    ]
    if (categoryId) where.categoryId = categoryId
    let products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    if (stockStatus === 'low') products = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold)
    else if (stockStatus === 'out') products = products.filter(p => p.quantity === 0)
    else if (stockStatus === 'in') products = products.filter(p => p.quantity > p.lowStockThreshold)
    res.json(products)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getOne = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { category: true, movements: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 } }
    })
    if (!product) return res.status(404).json({ message: 'Not found' })
    res.json(product)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { name, sku, categoryId, price, quantity, lowStockThreshold, serialNumber, manufacturer } = req.body
    if (!name || !sku || !categoryId || price == null || quantity == null || lowStockThreshold == null)
      return res.status(400).json({ message: 'Required fields missing' })
    // Make sure the chosen category belongs to this user.
    const category = await prisma.category.findFirst({ where: { id: categoryId, userId: req.user.id } })
    if (!category) return res.status(400).json({ message: 'Invalid category' })
    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({ data: { name, sku, categoryId, userId: req.user.id, price: parseFloat(price), quantity: parseInt(quantity), lowStockThreshold: parseInt(lowStockThreshold), serialNumber, manufacturer }, include: { category: true } })
      if (quantity > 0) {
        await tx.stockMovement.create({ data: { productId: p.id, type: 'IN', quantity: parseInt(quantity), reason: 'Initial stock', userId: req.user.id } })
      }
      return p
    })
    res.status(201).json(product)
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'SKU already exists' })
    res.status(500).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { name, sku, categoryId, price, quantity, lowStockThreshold, serialNumber, manufacturer } = req.body
    // Ownership check before updating.
    const existing = await prisma.product.findFirst({ where: { id: req.params.id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ message: 'Not found' })
    if (categoryId) {
      const category = await prisma.category.findFirst({ where: { id: categoryId, userId: req.user.id } })
      if (!category) return res.status(400).json({ message: 'Invalid category' })
    }
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, sku, categoryId, price: parseFloat(price), quantity: parseInt(quantity), lowStockThreshold: parseInt(lowStockThreshold), serialNumber, manufacturer },
      include: { category: true }
    })
    res.json(product)
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'SKU already exists' })
    res.status(500).json({ message: err.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const existing = await prisma.product.findFirst({ where: { id: req.params.id, userId: req.user.id } })
    if (!existing) return res.status(404).json({ message: 'Not found' })
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getDashboardStats = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { userId: req.user.id }, include: { category: true } })
    const totalProducts = products.length
    const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
    const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length
    const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).map(p => ({ name: p.name, sku: p.sku }))
    const outOfStock = products.filter(p => p.quantity === 0).length
    const categoryCount = await prisma.category.count({ where: { userId: req.user.id } })
    res.json({ totalProducts, totalValue, lowStockCount, lowStockItems, outOfStock, categoryCount })
  } catch (err) { res.status(500).json({ message: err.message }) }
}