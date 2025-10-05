import request from 'supertest'
import app from '../server.js'

describe('Auth Routes', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})
