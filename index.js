const http = require('http')
const app = require('./app') 
const config = require('./Utils/config')
const logger = require('./Utils/logger.js')


//mongoose.connect(config.MONGOURL)
const server = http.createServer(app)


server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})