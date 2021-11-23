const blogsRouter = require('express').Router()
const Blog = require('../Models/Blog')
const User = require('../Models/User')

blogsRouter.get('/', async (request, response, next) => {
    
    try{
        const blogs = await Blog.find({}).populate('user')
        response.json(blogs)
    }catch(ex){
        next(ex)
    }
    
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    try{
        const user = await User.findById( request.body.user )        
        const newBlog = await blog.save()

        let updatedUser = { user: user.user, username: user.username, password: user.password, notes:user.notes }
        updatedUser.notes = updatedUser.notes.concat(newBlog._id)
        const usernew = await User.findByIdAndUpdate(request.body.user, updatedUser )
        response.status(201).json(newBlog)
    }catch(ex){
        next(ex)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    try{
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
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