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

        expect( response.body[0]._id ).toBeDefined()

    })
})

afterAll(() => {
    mongoose.connection.close()
})