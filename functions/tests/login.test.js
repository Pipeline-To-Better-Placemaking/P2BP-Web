const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const User = require('../models/users')

const baseUrl = '/api/login'

const testUser = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'test@yahoo.com',
    password: '1#Aadmin'
}

describe('When logging in', () => {

    beforeEach(async () => {
        // Begin each test with a known user record in the database

        await User.deleteMany({})
        const user = new User({
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            email: testUser.email,
            password: testUser.password
        })
        await User.addUser(user)
    })
    
    test('login succeeds with valid email and password', async () => {

        const response = await api
            .post(baseUrl)
            .send(testUser)
            // Confirm successful login
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // Confirm that response contains email
        expect(response.body).toMatchObject({ user: { email: testUser.email } })
        
        // Confirm that response contains authorization token
        expect(response.body.token)

        // Confirm that the token is accurate
        const payload = th.decodeToken(response.body.token)
        expect(payload.email).toBeDefined()
        expect(payload.email).toMatch(testUser.email)
    })

    test('login fails (401) with missing email', async () => {
        const badCreds = {
            password: testUser.password
        }

       await api
            .post(baseUrl)
            .send(badCreds)
            // Confirm unsuccessful login
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('login fails (401) with missing password', async () => {
        const badCreds = {
            email: testUser.email
        }

        await api
            .post(baseUrl)
            .send(badCreds)
            // Confirm unsuccessful login
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('login fails (401) with invalid email', async () => {
        const badCreds = {
            email: 'notauser@yahoo.com',
            password: testUser.password
        }

        await api
            .post(baseUrl)
            .send(badCreds)
            // Confirm unsuccessful login
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('login fails (401) with invalid password', async () => {
        const badCreds = {
            email: testUser.email,
            password: 'wrong'
        }

        await api
            .post(baseUrl)
            .send(badCreds)
            // Confirm unsuccessful login
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll(() => {
    mongoose.connection.close()
    app.close()
})