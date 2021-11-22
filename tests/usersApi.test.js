const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../Models/User')
const api = supertest(app)

const initialUsers = [
    {
        "user": "Isaac",
        "password": "123",
    },
    {
        "user": "Genesis",
        "password": "321",
    }
]


describe('Test For users', () => {
    beforeEach( async () =>{
        await User.deleteMany({})
        let users = initialUsers.map( user => new User(user))
        let savedUsers = users.map( user => user.save() )
        await Promise.all(savedUsers)
    },15000)

    test('Return all users', async () => {
        const users = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(users.body.length).toBe(initialUsers.length)
    },10000)

    test('User with same user should not be allowed ', async () => {
        let newUser = {
            "user": "Isaac",
            "password": "321",
        }
        await api.post('/api/users')
        .send(newUser)
        .expect(400)

    })

    test('New user is added', async () => {
        let newUser = {
            "user": "Cristina",
            "password": "456",
        }

        let savedUser = await api.post('/api/users')
        .send(newUser)
        .expect(201)

        expect( savedUser.body.user ).toEqual( newUser.user )
    })
})

afterAll(() => {
    mongoose.connection.close()
})