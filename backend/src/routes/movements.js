const router = require('express').Router()
const auth = require('../middleware/auth')
const { getAll, create } = require('../controllers/movementController')

router.use(auth)
router.get('/', getAll)
router.post('/', create)

module.exports = router