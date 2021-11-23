const userRouter = require('express').Router()
const User = require('../Models/User')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res, next) => {
    try{
        const users = await User.find({}).populate('notes')
        res.json(users)
    }catch(ex){
        next(ex)
    }
})

userRouter.post('/', async (req, res, next) => {
    try{
        if( !req.body.password || req.body.password.length < 3 ){
            res.status(400).send({error:'Password invalid, must be at least 3 characters long'})
        }
        
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