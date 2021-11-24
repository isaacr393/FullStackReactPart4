const cors = require('cors')
const express = require('express')
const app = express()

const blogsRouter = require('./Controllers/blogs')
const userRouter = require('./Controllers/users')
const loginRouter = require('./Controllers/login')

const config = require('./Utils/config')
const logger = require('./Utils/logger.js')
const middleware = require('./Utils/middleware')
const mongoose = require('mongoose')

logger.info(`Connecting to ${config.MONGOURL}`)

mongoose.connect(config.MONGOURL)
.then( () => logger.info('Connected Succesfully'))
.catch( err => {
    logger.error('Err at connecting ')
    logger.error(err)
})

app.use(cors())
app.use( express.static('build') )
app.use(express.json())
app.use( middleware.requestLog )

app.use('/api/blogs', blogsRouter )
app.use('/api/users', userRouter )
app.use('/api/login', loginRouter )

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app