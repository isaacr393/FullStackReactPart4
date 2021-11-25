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
const initialUser = {
    "user": "Isaac",
    "username": "Isaac",
    "password": "123",
}


describe('Testing Api', () => {
    let token = ""
    beforeAll( async () => {
        //Login with that user
        let registeredUser = await api.post('/api/login')
        .send(initialUser)

        token = registeredUser.body.token
        await Blog.deleteMany({})

    },20000)

    test('New blog is created', async () => {

        for( let blog of initialBlogs){
            const response = await api.post('/api/blogs')
            .send(blog)
            .auth(token, { type: 'bearer' })
            .expect(201)
            .expect('Content-Type', /application\/json/)

            expect( response.body.title ).toBe(blog.title)
        }

        const blogsRegistered = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        expect(blogsRegistered.body.length).toBe(initialBlogs.length)

    },10000)


    test('GET api should return all registers', async () => {
        const response = await api.get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect( response.body.length ).toBe(initialBlogs.length)

    })
    
    test('Unique identifier should be id', async () => {
        const response = await api.get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect( response.body[0].id ).toBeDefined()

    })

    test('New Blog with no likes must have 0 likes',async () => {
        let newBlog = {
            title: 'No likest title',
            author:'NoLiked',
            url:'Jesttesting.com',
        }
        
        const response = await api.post('/api/blogs')
        .send(newBlog)
        .auth(token, { type: 'bearer' })
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
        .auth(token, { type: 'bearer' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect( response.body.error ).toBeDefined()


    })

    
    test('Blog should be deleted ',async () => {
        
        const currentBlog = await api.get('/api/blogs')        
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.delete('/api/blogs/'+currentBlog.body[0].id)
        .auth(token, { type: 'bearer' })
        .expect(204)

        const afterDeleteBlog = await api.get('/api/blogs')

        expect(afterDeleteBlog.body.length).toBe( 2 )

    },10000)

    
    test('Blog should be updated ',async () => {        

        const currentBlog = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        let updateBlog = currentBlog.body[0]
        updateBlog.likes = 30
        delete updateBlog.user
        //console.log(updateBlog)

        let responseBlog = await api.put('/api/blogs/'+updateBlog.id)
        .send(updateBlog)
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(responseBlog.body.likes).toBe(30)

    },10000)
})

afterAll(() => {
    mongoose.connection.close()
})