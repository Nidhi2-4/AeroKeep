require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    /\.vercel\.app$/,
    /\.onrender\.com$/
  ],
  credentials: true
}))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'AeroKeep API online', env: process.env.NODE_ENV }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/movements', require('./routes/movements'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`🚀 AeroKeep API running on port ${PORT}`))