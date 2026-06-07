const prisma = require('../prisma')

exports.getAll = async (req, res) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: { product: { select: { name: true, sku: true } }, user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(movements)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body
    if (!productId || !type || !quantity || !reason)
      return res.status(400).json({ message: 'All fields required' })
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } })
      if (!product) throw new Error('Product not found')
      const newQty = type === 'IN' ? product.quantity + parseInt(quantity) : product.quantity - parseInt(quantity)
      if (newQty < 0) throw new Error('Insufficient stock')
      const updated = await tx.product.update({ where: { id: productId }, data: { quantity: newQty } })
      const movement = await tx.stockMovement.create({
        data: { productId, type, quantity: parseInt(quantity), reason, userId: req.user.id },
        include: { product: { select: { name: true, sku: true } }, user: { select: { name: true } } }
      })
      return { movement, updatedProduct: updated }
    })
    res.status(201).json(result)
  } catch (err) { res.status(500).json({ message: err.message }) }
}