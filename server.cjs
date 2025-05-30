const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Custom middleware to expose x-total-count header
server.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'X-Total-Count')
  next()
})

server.use(middlewares)
server.use(router)

server.listen(4000, () => {
  console.log('JSON Server is running on http://localhost:4000')
})