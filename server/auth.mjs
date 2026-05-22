import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-only-do-not-use-in-prod'
const TTL_HOURS = Number(process.env.TOKEN_TTL_HOURS || 12)

export function signToken(payload = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: `${TTL_HOURS}h` })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'missing token' })
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'invalid or expired token' })
  req.user = payload
  next()
}
