
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

app.get('/status', (req, res) => {
  res.send('Backend is running ✅')
})

app.post('/register', async (req, res) => {
  const { email, password, name, birthdate, gender } = req.body
  const hashed = await bcrypt.hash(password, 10)

  try {
    await pool.query(
      'INSERT INTO users (email, password, name, birthdate, gender) VALUES ($1, $2, $3, $4, $5)',
      [email, hashed, name, birthdate, gender]
    )
    res.json({ message: 'User registered' })
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET)
  res.json({ token })
})

app.get('/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'No token' })

  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ user: decoded })
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
