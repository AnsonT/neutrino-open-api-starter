import request from 'supertest'
import initApp from '../src/app'
jest.setTimeout(30000)

describe('foo API', () => {
  beforeAll(async () => {
    global.app = await initApp()
  })

  it('succeeds', async () => {
    const res = await request(global.app).get('/api/v1/foo')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('foo')
  })
})
