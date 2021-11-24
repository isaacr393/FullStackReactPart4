const loginRouter = require('express').Router()
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


loginRouter.post('/', async  (req, res, next) => {
    let username = req.body.username
    let password = req.body.password

    if( !username || !password ){
        return res.status(401).send({error:'Missing Credentials'})
    }

    try{
        let user = await User.findOne({username:username})
        let passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)

        if( !passwordCorrect || user === null ){
            return res.status(401).send({error:'Invalid Credentials'})
        }
        
        let userObjForToken = {
            username: username,
            id: user._id
        }

        const token = jwt.sign( userObjForToken, process.env.SECRET)

        return res.status(200).send({ token: token, username:username, user: user.user})
    }catch( ex ){
        next(ex)
    }

})




module.exports = loginRouter