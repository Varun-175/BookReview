import request from 'supertest'
import app from '../server.js'

describe('Books', () => {
  it('GET /api/books -> 200 json', async () => {
    const res = await request(app).get('/api/books')
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toMatch(/json/)
  }, 20000)
})
