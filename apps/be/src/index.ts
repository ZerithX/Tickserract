import { Hono } from 'hono'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', logger())

const routes = app.get('/', (c) => {
  return c.json({
    message: 'Welcome to Tickserract API',
    status: 'healthy'
  })
})

export type AppType = typeof routes
export default {
  port: 8080,
  fetch: app.fetch,
}
