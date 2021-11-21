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
        id: "6199230e348d95351b31d5ac"
    },
    {
        title: "First app",
        author: "Isaac",
        url: "thisisfakeurl.com",
        likes: 10,
        id: "619a769f5ce6f7aad953007b"
    }
]


describe('Testing Api', () => {
    beforeEach( async () => {
        await Blog.deleteMany({})
        let createdBlogs = initialBlogs.map( blog => new Blog(blog))
        let savedBlogs = createdBlogs.map( blog => blog.save() )
        await Promise.all(savedBlogs)
    })

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
        let newBlog = {
            title: 'Created From Jest',
            author:'Jest',
            url:'Jesttesting.com',
            likes:20
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

    })

    test('New Blog with no likes must have 0 likes',async () => {
        let newBlog = {
            title: 'No likest title',
            author:'NoLiked',
            url:'Jesttesting.com',
        }
        
        const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        expect( response.body.likes ).toEqual(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})