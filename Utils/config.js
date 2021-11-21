require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGOURL = process.env.NODE_ENV === 'test'
?process.env.TEST_MONGODB_URI
:process.env.MONGODB_URL

module.exports = {
    PORT,
    MONGOURL
}