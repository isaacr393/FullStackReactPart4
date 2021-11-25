const morgan = require('morgan')
const logger = require('./logger')

const requestLogger = (token, req, res) => {
    logger.info(` ${req.method} - ${req.url} - ${JSON.stringify(req.body)} - ${token['response-time'](req, res)} -ms `)
}

const unknownEndpoint = (req, res, next) => {
    res.status(404).send({error: 'UnknownEndpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
const tokenRequired = (req, res, next) => {
  const authorization = req.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.body.userToken = authorization.substring(7)  
  }  
  next()
}

const requestLog = morgan(requestLogger)

module.exports = {
    requestLog,
    unknownEndpoint,
    errorHandler,
    tokenRequired
}