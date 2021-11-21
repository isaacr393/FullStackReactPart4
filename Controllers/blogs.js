const blogsRouter = require('express').Router()
const Blog = require('../Models/Blog')

blogsRouter.get('/', async (request, response, next) => {
    
    try{
        const blogs = await Blog.find({})
        response.json(blogs)
    }catch(ex){
        next(ex)
    }
    
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    try{
        const newBlog = await blog.save()
        response.status(201).json(newBlog)
    }catch(ex){
        next(ex)
    }
})
module.exports = blogsRouter