const userRouter = require('express').Router()
const User = require('../Models/User')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res, next) => {
    try{
        const users = await User.find({})
        res.json(users)
    }catch(ex){
        next(ex)
    }
})

userRouter.post('/', async (req, res, next) => {
    try{
        let saltRounds = 10
        let password = await bcrypt.hash(req.body.password, saltRounds )
        let user = new User({...req.body, password })
        let newUser =  await user.save()

        res.status(201).json(newUser)
    }catch(ex){
        next(ex)
    }
})

module.exports = userRouter