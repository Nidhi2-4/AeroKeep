const prisma = require('../prisma')

exports.getAll = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'asc' }
    })
    res.json(categories)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) return res.status(400).json({ message: 'Name required' })
    const category = await prisma.category.create({ data: { name, description } })
    res.status(201).json(category)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.update = async (req, res) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body })
    res.json(category)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.remove = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted' })
  } catch (err) {
    if (err.code === 'P2003') return res.status(400).json({ message: 'Cannot delete — active products linked' })
    res.status(500).json({ message: err.message })
  }
}