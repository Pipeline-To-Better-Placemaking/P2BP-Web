const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const User = require('../models/users')

const baseUrl = '/api/users'

describe('When creating a new user account', () => {

    beforeEach(async () => {
        // Begin each test with an empty database
        await User.deleteMany({})
    })

    test('creation succeeds with valid information', async () => {
        const usersBefore = await th.getUsers()
        
        const newUser = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@yahoo.com',
            password: '!1Abcdef'
        }

        await api
            .post(baseUrl)
            .send(newUser)
            // Confirm success
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await th.getUsers()
        // Check if there is now one more user than before
        expect(usersAfter).toHaveLength(usersBefore.length + 1)

        // Check if the user is in the database
        expect(usersAfter).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email
                })
            ])
        )
    })

    test('creation fails (400) with missing email', async () => {
        const usersBefore = await th.getUsers()
        
        const newUser = {
            firstname: 'John',
            lastname: 'Doe',
            password: '!1Abcdef'
        }

        await api
            .post(baseUrl)
            .send(newUser)
            // Confirm failure
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await th.getUsers()
        // Check if there is still the same numer of users as before
        expect(usersAfter).toHaveLength(usersBefore.length)

        // Check to make sure this user did not get added to the database
        expect(usersAfter).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    firstname: newUser.firstname,
                    lastname: newUser.lastname
                })
            ])
        )
    })

    test('creation fails (400) with missing password', async () => {
        const usersBefore = await th.getUsers()
        
        const newUser = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@yahoo.com'
        }

        await api
            .post(baseUrl)
            .send(newUser)
            // Confirm failure
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await th.getUsers()
        // Check if there is still the same numer of users as before
        expect(usersAfter).toHaveLength(usersBefore.length)

        // Check to make sure this user did not get added to the database
        expect(usersAfter).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email
                })
            ])
        )
    })

    test('creation fails (400) with invalid email', async () => {
        const usersBefore = await th.getUsers()
        
        const newUser = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'invalidemail.com',
            password: '!1Abcdef'
        }

        await api
            .post(baseUrl)
            .send(newUser)
            // Confirm failure
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await th.getUsers()
        // Check if there is still the same numer of users as before
        expect(usersAfter).toHaveLength(usersBefore.length)

        // Check to make sure this user did not get added to the database
        expect(usersAfter).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email
                })
            ])
        )
    })

    describe('creation fails (400) with invalid password', () => {
        test('too short', async () => {
            const usersBefore = await th.getUsers()
            
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@yahoo.com',
                password: '!1Abcde'
            }
    
            await api
                .post(baseUrl)
                .send(newUser)
                // Confirm failure
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAfter = await th.getUsers()
            // Check if there is still the same numer of users as before
            expect(usersAfter).toHaveLength(usersBefore.length)
    
            // Check to make sure this user did not get added to the database
            expect(usersAfter).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email
                    })
                ])
            )
        })

        test('contains whitespace', async () => {
            const usersBefore = await th.getUsers()
            
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@yahoo.com',
                password: '!1Ab def'
            }
    
            await api
                .post(baseUrl)
                .send(newUser)
                // Confirm failure
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAfter = await th.getUsers()
            // Check if there is still the same numer of users as before
            expect(usersAfter).toHaveLength(usersBefore.length)
    
            // Check to make sure this user did not get added to the database
            expect(usersAfter).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email
                    })
                ])
            )
        })

        test('does not have a number', async () => {
            const usersBefore = await th.getUsers()
            
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@yahoo.com',
                password: '!aAbcdef'
            }
    
            await api
                .post(baseUrl)
                .send(newUser)
                // Confirm failure
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAfter = await th.getUsers()
            // Check if there is still the same numer of users as before
            expect(usersAfter).toHaveLength(usersBefore.length)
    
            // Check to make sure this user did not get added to the database
            expect(usersAfter).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email
                    })
                ])
            )
        })

        test('does not have a symbol', async () => {
            const usersBefore = await th.getUsers()
            
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@yahoo.com',
                password: 'a1Abcdef'
            }
    
            await api
                .post(baseUrl)
                .send(newUser)
                // Confirm failure
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAfter = await th.getUsers()
            // Check if there is still the same numer of users as before
            expect(usersAfter).toHaveLength(usersBefore.length)
    
            // Check to make sure this user did not get added to the database
            expect(usersAfter).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email
                    })
                ])
            )
        })

        test('does not have a capital letter', async () => {
            const usersBefore = await th.getUsers()
            
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'test@yahoo.com',
                password: '!1abcdef'
            }
    
            await api
                .post(baseUrl)
                .send(newUser)
                // Confirm failure
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAfter = await th.getUsers()
            // Check if there is still the same numer of users as before
            expect(usersAfter).toHaveLength(usersBefore.length)
    
            // Check to make sure this user did not get added to the database
            expect(usersAfter).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email
                    })
                ])
            )
        })
    })

    test('creation fails (400) if email is already in use', async () => {
        const user = new User({
            email: 'test@gmail.com',
            password: '!1Aaaaaa'
        })
        await User.addUser(user)
        
        const newUser = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@gmail.com',
            password: '!1Abcdef'
        }
        
        const usersBefore = await th.getUsers()

        await api
            .post(baseUrl)
            .send(newUser)
            // Confirm failure
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await th.getUsers()
        // Check if there is still the same numer of users as before
        expect(usersAfter).toHaveLength(usersBefore.length)

        // Check to make sure this user did not get added to the database
        expect(usersAfter).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email
                })
            ])
        )
    })
})

afterAll(() => {
    mongoose.connection.close()
    app.close()
})