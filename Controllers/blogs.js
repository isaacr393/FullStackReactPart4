const blogsRouter = require('express').Router()
const Blog = require('../Models/Blog')
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const tokenRequired = require('../Utils/middleware').tokenRequired

blogsRouter.get('/', async (request, response, next) => {
    
    try{
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    }catch(ex){
        next(ex)
    }
    
})

blogsRouter.post('/', tokenRequired, async (request, response, next) => {
    const blog = new Blog(request.body)
    try{
        const userToken = request.body.userToken
        if( !userToken ){
            response.status(401).send({error:'Authentication required'})
        }         
        let decodedToken = jwt.verify(userToken, process.env.SECRET)

        const user = await User.findById( decodedToken.id )  
        blog.user = user._id      
        const newBlog = await blog.save()

        let updatedUser = { user: user.user, username: user.username, password: user.password, notes:user.notes }
        updatedUser.notes = updatedUser.notes.concat(newBlog._id)

        await User.findByIdAndUpdate(decodedToken.id, updatedUser )
        response.status(201).json(newBlog)
    }catch(ex){
        next(ex)
    }
})

blogsRouter.delete('/:id', tokenRequired, async (req, res, next) => {
    try{
        const userToken = req.body.userToken
        if( !userToken ){
            res.status(401).send({error:'Authentication required'})
        }         
        let decodedToken = jwt.verify(userToken, process.env.SECRET)

        const user = await User.findById( decodedToken.id )  
        const blog = await Blog.findById(req.params.id)

        if( blog.user.toString() === user._id.toString()){
            await Blog.findByIdAndRemove(req.params.id)
            res.status(204).end()
        }else{
            return res.json({error:'Authentication failed'})  
        }
        
    }catch( ex ){
        next(ex)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
    try{
        let newBlog = req.body
        let blog = await Blog.findByIdAndUpdate(req.params.id, newBlog,{ new:true, runValidators:true })
        res.status(200).json(blog)
    }catch( ex ){
        next(ex)
    }
})

module.exports = blogsRouter