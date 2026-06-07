const router = require('express').Router()
const auth = require('../middleware/auth')
const { getAll, getOne, create, update, remove, getDashboardStats } = require('../controllers/productController')

router.use(auth)
router.get('/stats', getDashboardStats)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router