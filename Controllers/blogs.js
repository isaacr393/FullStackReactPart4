const blogsRouter = require('express').Router()
const Blog = require('../Models/Blog')
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const tokenRequired = require('../Utils/middleware').tokenRequired
const userExtractor = require('../Utils/middleware').userExtractor

blogsRouter.use(tokenRequired)

blogsRouter.get('/', async (request, response, next) => {
    
    try{
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    }catch(ex){
        next(ex)
    }
    
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
    const blog = new Blog(request.body)
    try{

        const user = request.user
        blog.user = user._id      
        const newBlog = await blog.save()

        let updatedUser = { user: user.user, username: user.username, password: user.password, notes:user.notes }
        updatedUser.notes = updatedUser.notes.concat(newBlog._id)

        await User.findByIdAndUpdate(user._id.toString(), updatedUser )
        response.status(201).json(newBlog)
    }catch(ex){
        next(ex)
    }
})

blogsRouter.delete('/:id',userExtractor,  async (req, res, next) => {
    try{
        const user = req.user
        const blog = await Blog.findById(req.params.id)
        if( blog.user.toString() === user._id.toString()){
            await Blog.findByIdAndRemove(req.params.id)
            res.status(204).end()
        }else{
            return res.status(401).send({error:'Authentication failed'})  
        }
        
    }catch( ex ){
        next(ex)
    }
})

blogsRouter.put('/:id',userExtractor, async (req, res, next) => {
    try{

        const user = req.user
        const blog = await Blog.findById(req.params.id)
        let newBlog = req.body

        if( blog.user.toString() === user._id.toString()){
            let blog = await Blog.findByIdAndUpdate(req.params.id, newBlog,{ new:true, runValidators:true })
            res.status(200).json(blog)
        }else{
            return res.status(401).send({error:'Authentication failed'})  
        }                
    }catch( ex ){
        next(ex)
    }
})

module.exports = blogsRouter