import { Hono } from 'hono'
import { logger } from 'hono/logger'
import auth from './routes/auth.js'
import { verifyAuth, verifyRole } from './middleware/auth.js'

const app = new Hono()

app.use('*', logger())

app.route('/api/auth', auth)

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to Tickserract API',
    status: 'healthy'
  })
})

app.get('/api/protected', verifyAuth, (c) => {
  const payload = c.get('jwtPayload')
  return c.json({
    message: 'You have access',
    user: payload
  })
})

app.get('/api/organizer', verifyAuth, verifyRole(['organizer']), (c) => {
  return c.json({
    message: 'Welcome Organizer'
  })
})

export type AppType = typeof app
export default {
  port: 8080,
  fetch: app.fetch,
}
