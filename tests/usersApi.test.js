const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../Models/User')
const api = supertest(app)

const initialUsers = [
    {
        "user": "Isaac",
        "username": "Isaac",
        "password": "123",
    }
]


describe('Test For users', () => {
    beforeAll( async () =>{
        await User.deleteMany({})

        //Register One user
        let savedUser = await api.post('/api/users')
        .send(initialUsers[0])

        /* let users = initialUsers.map( user => new User(user))
        let savedUsers = users.map( user => user.save() )
        await Promise.all(savedUsers)*/
    },25000)

    test('Return all users', async () => {
        const users = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(users.body.length).toBe(initialUsers.length)
    },15000)

    test('User with same user should not be allowed ', async () => {
        let newUser = {
            "user": "Isaac",
            "username": "Isaac",
            "password": "321",
        }
        await api.post('/api/users')
        .send(newUser)
        .expect(400)

    })

    test('Invalid user should not be created', async () => {
        let newUser = {
            "user": "Cri",
            "username": "Cr",
            "password": "456",
        }

        let savedUser = await api.post('/api/users')
        .send(newUser)
        .expect(400)

    })

    test('New user is added', async () => {
        let newUser = {
            "user": "Cristina",
            "username": "Cristina",
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