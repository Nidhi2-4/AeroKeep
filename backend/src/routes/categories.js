const router = require('express').Router()
const auth = require('../middleware/auth')
const { getAll, create, update, remove } = require('../controllers/categoryController')

router.use(auth)
router.get('/', getAll)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router