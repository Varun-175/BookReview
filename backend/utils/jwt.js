import jwt from 'jsonwebtoken'

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET)
