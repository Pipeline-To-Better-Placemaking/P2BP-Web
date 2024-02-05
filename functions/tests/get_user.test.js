const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const User = require('../models/users')

const baseUrl = '/api/users'

const testUser = {
    firstname: 'John',
    lastname: 'Doe',
    institution: 'University of Central Florida',
    email: 'test@yahoo.com',
    password: '1#Aadmin'
}

describe('When getting user\'s own info', () => {

    let token = null

    beforeAll(async () => {
        // Begin with a known user record in the database
        await User.deleteMany({})
        const user = new User({
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            institution: testUser.institution,
            email: testUser.email,
            password: testUser.password
        })
        await User.addUser(user)
        token = th.getToken(user)
    })

    test('all appropriate info is returned', async () => {
        const response = await api
            .get(`${baseUrl}`)
            .set('Authorization', 'Bearer ' + token)
            // Should succeed
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // Should contain the following info
        expect(response.body).toMatchObject({
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            institution: testUser.institution,
            email: testUser.email
        })
        expect(response.body.is_verified).toBeDefined()
        expect(response.body.invites).toBeDefined()
        expect(response.body.teams).toBeDefined()

        // Should not contain the following info
        expect(response.body.password).not.toBeDefined()
        expect(response.body.verification_code).not.toBeDefined()
        expect(response.body.verification_timeout).not.toBeDefined()
    })

    test('request fails (401) if token is not provided', async () => {
        await api
            .get(`${baseUrl}`)
            // Should fail
            .expect(401)
    })
})

describe('When getting a different user\'s info', () => {

    let id = null

    beforeAll(async () => {
        // Begin with a known user record in the database
        await User.deleteMany({})
        const user = new User({
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            institution: testUser.institution,
            email: testUser.email,
            password: testUser.password
        })
        await User.addUser(user)
        id = user._id
    })

    test('all appropriate info is returned', async () => {
        const response = await api
            .get(`${baseUrl}/${id}`)
            // Should succeed
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // Should contain the follwing info
        expect(response.body).toMatchObject({
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            institution: testUser.institution,
            email: testUser.email
        })
        expect(response.body.teams).toBeDefined()

        // Should not contain the following info
        expect(response.body.password).not.toBeDefined()
        expect(response.body.is_verified).not.toBeDefined()
        expect(response.body.verification_code).not.toBeDefined()
        expect(response.body.verification_timeout).not.toBeDefined()
        expect(response.body.invites).not.toBeDefined()
    })

    test('request fails (404) if user does not exist', async () => {
        await api
            .get(`${baseUrl}/${await th.getUnusedUserId()}`)
            // Should fail
            .expect(404)
    })
})

afterAll(() => {
    mongoose.connection.close()
    app.close()
})