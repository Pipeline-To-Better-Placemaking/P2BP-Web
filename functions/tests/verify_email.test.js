const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const User = require('../models/users')

const baseUrl = '/api/verify'

const testUser = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'test@yahoo.com',
    password: '1#Aadmin'
}

describe('Model functions', () => {
    let id = null

    beforeEach(async () => {
        // Begin with a known user record in the database
        await User.deleteMany({})
        const user = new User({
            firstname: testUser.firstname,
            lastname: testUser.lastname,
            email: testUser.email,
            password: testUser.password
        })
        const savedUser = await User.addUser(user)
        id = savedUser._id
    })

    describe('createVerification', () => {
        test('succeeds with a valid user id', async () => {
            // Get user's verification code before it is regenerated
            let user = await User.findById(id)
            const codeBefore = user.verification_code

            // Regenerate the user's code
            const code = await User.createVerification(id)

            // User should now have a new code
            user = await User.findById(id)
            expect(user.verification_code).toBeDefined()
            expect(user.verification_timeout).toBeDefined()
            expect(code).toEqual(user.verification_code)
            expect(user.verification_code).not.toEqual(codeBefore)
        })

        test('fails with an invalid user id', async () => {
            // Get user's verification code before it is regenerated
            let user = await User.findById(id)
            const codeBefore = user.verification_code

            // Try to regenerate a nonexistent user's code
            const code = await User.createVerification('0' + String(id).slice(0, -1))

            // New code should not have been generated
            expect(code).not.toBeDefined()
            // User's code should be the same as before
            user = await User.findById(id)
            expect(user.verification_code).toEqual(codeBefore)
        })
    })

    describe('verifyEmail', () => {
        test('succeeds with the correct verification code', async () => {
            let user = await User.findById(id)
            const code = await User.createVerification(id)
            // User's email address should not yet be verified
            expect(user.is_verified).toEqual(false)

            const success = await User.verifyEmail(id, code)
            expect(success).toEqual(true)
            // User's email address should now be verified
            user = await User.findById(id)
            expect(user.is_verified).toEqual(true)
        })

        test('fails with the incorrect verification code', async () => {
            const user = await User.findById(id)
            const code = await User.createVerification(id)
            const success = await User.verifyEmail(id, '0' + code)

            // Verification should fail
            expect(success).toEqual(false)
            expect(user.is_verified).toEqual(false)
        })

        test('fails with an invalid user id', async () => {
            const user = await User.findById(id)
            const code = await User.createVerification(id)
            const success = await User.verifyEmail('0' + String(id).slice(0, -1), code)

            // Verification should fail
            expect(success).toEqual(false)
            expect(user.is_verified).toEqual(false)
        })
    })
})

describe('When a new user has just been created', () => {
    describe('verifying the user\'s email address', () => {
        // The user's id
        let id = null
        // The user's email verification code
        let code = null

        beforeAll(async () => {
            // Create a new user
            await User.deleteMany({})
            const user = new User({
                firstname: testUser.firstname,
                lastname: testUser.lastname,
                email: testUser.email,
                password: testUser.password
            })
            const savedUser = await User.addUser(user)
            id = savedUser._id
            code = savedUser.verification_code
        })

        test('fails (400) if the specified email is not associated with an existing user', async () => {
            await api
                .post(`${baseUrl}?email=nobody@gmail.com&code=${code}`)
                .expect(400)

            // User's email should still not be verified
            const user = await User.findById(id)
            expect(user.is_verified).toEqual(false)
        })
    
        test('fails (403) if the verification code is incorrect', async () => {
            await api
                .post(`${baseUrl}?email=${testUser.email}&code=${'0' + String(code).slice(0, -1)}`)
                .expect(403)

            // User's email should still not be verified
            const user = await User.findById(id)
            expect(user.is_verified).toEqual(false)
        })
    
        test('succeeds (200) if the verification code is correct', async () => {
            // User's email should not yet be verified
            let user = await User.findById(id)
            expect(user.is_verified).toEqual(false)

            await api
                .post(`${baseUrl}?email=${testUser.email}&code=${code}`)
                .expect(200)

            // User's email should now be verified
            user = await User.findById(id)
            expect(user.is_verified).toEqual(true)
        })
    })

    describe('generating a new verification code', () => {
        // The user's id
        let id = null
        // User's authentication token
        let token = null
        
        beforeAll(async () => {
            // Create a new user
            await User.deleteMany({})
            const user = new User({
                firstname: testUser.firstname,
                lastname: testUser.lastname,
                email: testUser.email,
                password: testUser.password
            })
            const savedUser = await User.addUser(user)
            id = savedUser._id
            token = th.getToken(user)
        })

        test('succeeds (200) if valid token is given', async () => {
            // Save user's current verification code
            let user = await User.findById(id)
            const initialCode = user.verification_code
            
            await api
                .post(`${baseUrl}/newcode`)
                .set('Authorization', 'Bearer ' + token)
                .expect(200)

            // Verification code should have changed
            user = await User.findById(id)
            expect(user.verification_code).not.toEqual(initialCode)
        })

        test('fails (401) if token is missing or invalid', async () => {
            // Save user's current verification code
            let user = await User.findById(id)
            const initialCode = user.verification_code
            
            await api
                .post(`${baseUrl}/newcode`)
                .expect(401)
            await api
                .post(`${baseUrl}/newcode`)
                .set('Authorization', 'Bearer 0' + String(token).slice(0, -1))
                .expect(401)

            // Verification code should not have changed
            user = await User.findById(id)
            expect(user.verification_code).toEqual(initialCode)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
    app.close()
})