import request from 'supertest'
import app from '../server.js'

describe('Reviews', () => {
  it('GET /api/reviews/book/:id -> 200 or 404', async () => {
    const res = await request(app).get('/api/reviews/book/000000000000000000000000')
    expect([200,404]).toContain(res.statusCode)
  }, 20000)
})
