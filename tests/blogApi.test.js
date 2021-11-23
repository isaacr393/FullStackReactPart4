const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../Models/Blog')
const api = supertest(app)


const initialBlogs = [
    {
        title: "Second app",
        url: "thisisfakeurl.com",
        likes: 10,
        author: "genesis",
    },
    {
        title: "First app",
        author: "Isaac",
        url: "thisisfakeurl.com",
        likes: 10,
    }
]


describe('Testing Api', () => {
    beforeAll( async () => {
        const users = await api.get('/api/users')
        await Blog.deleteMany({})
        let blogsWithUser = initialBlogs.map( blog => ({...blog, user:users.body[0].id}))
        let createdBlogs = blogsWithUser.map( blog => new Blog(blog))
        let savedBlogs = createdBlogs.map( blog => blog.save() )
        await Promise.all(savedBlogs)
    },20000)

    test('GET api should return all registers', async () => {
        const response = await api.get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect( response.body.length ).toBe(initialBlogs.length)

    })

    test('Unique identifies should be id', async () => {
        const response = await api.get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect( response.body[0].id ).toBeDefined()

    })

    test('New blog is created', async () => {
        const users = await api.get('/api/users')
        let newBlog = {
            title: 'Created From Jest',
            author:'Jest',
            url:'Jesttesting.com',
            likes:20,
            user:users.body[0].id
        }
        
        const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        expect( response.body.title ).toBe('Created From Jest')

        const blogsRegistered = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(blogsRegistered.body.length).toBe(initialBlogs.length + 1)

    },10000)

    test('New Blog with no likes must have 0 likes',async () => {
        const users = await api.get('/api/users')
        let newBlog = {
            title: 'No likest title',
            author:'NoLiked',
            url:'Jesttesting.com',
            user:users.body[0].id
        }
        
        const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        expect( response.body.likes ).toEqual(0)
    },10000)

    test('New Blog with no author or title must not be saved',async () => {
        let newBlog = {            
            url:'Jesttesting.com',
            likes: 5
        }
        
        const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect( response.body.error ).toBeDefined()


    })

    test('Blog should be deleted ',async () => {
        
        const currentBlog = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.delete('/api/blogs/'+currentBlog.body[0].id)
        .expect(204)

        const afterDeleteBlog = await api.get('/api/blogs')

        expect(afterDeleteBlog.body.length).toBe(3 )

    },10000)

    test('Blog should be updated ',async () => {
        
        const currentBlog = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        let updateBlog = currentBlog.body[0]
        updateBlog.likes = 30
        updateBlog.user = updateBlog.user.id
        const response = await api.put('/api/blogs/'+updateBlog.id)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        let afterUpdateBlogs = await api.get('/api/blogs')

        afterUpdateBlogs = afterUpdateBlogs.body.map(blog => blog.likes)

        expect(afterUpdateBlogs).toContainEqual(30)

    },10000)
})

afterAll(() => {
    mongoose.connection.close()
})