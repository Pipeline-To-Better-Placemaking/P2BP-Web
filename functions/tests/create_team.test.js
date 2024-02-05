const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const Team = require('../models/teams')
const User = require('../models/users')


const baseUrl = '/api/teams'

// const testUser = {
//     firstname: 'Ron',
//     lastname: 'Doe',
//     email: 'testdfdafarooo@yahoo.com',
//     password: '1#Aadmin'
// }

const testUser = {
    firstname: 'John',
    lastname: 'Doe',
    institution: 'University of Central Florida',
    email: 'test@yahoo.com',
    password: '1#Aadmin'
}
const mockObjectId = new mongoose.Types.ObjectId();



describe('When creating a team', () => {
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
    
    test('Creation succeeds', async () => {
        await Team.deleteMany({})
        const testTeam = {
            title: 'New Project',
            description: 'Its a secret',
            user: testUser,
            public: false
        }

        const response = await api
            .post(`${baseUrl}`)
            .set('Authorization', 'Bearer ' + token)
            .send(testTeam)
            // Confirm successful login
            .expect(201)
            .expect('Content-Type', /application\/json/)

        // Confirm that response contains email
        // expect(response.body).toMatchObject({ user: { email: testUser.email } })
        
        // // Confirm that response contains authorization token
        // expect(response.body.token)

        // // Confirm that the token is accurate
        // const payload = th.decodeToken(response.body.token)
        // expect(payload.email).toBeDefined()
        // expect(payload.email).toMatch(testUser.email)
    })

    // test('Get map created', async () => {
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc192ZXJpZmllZCI6ZmFsc2UsImludml0ZXMiOltdLCJ0ZWFtcyI6W10sIl9pZCI6IjYyNjQyNGMyNmJmNTExM2IzNDI5NTI5OCIsImZpcnN0bmFtZSI6IlJvbiIsImxhc3RuYW1lIjoiRG9lIiwiZW1haWwiOiJ0ZXN0ZGZkYWZhcm9vb0B5YWhvby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRkcGZjYU1OWTZPS1U2Z0dJb0pRajVlQjFLUXJCcS5LVVJ6OVFPVm1SdEpVWEdDRDJzbnFvYSIsIl9fdiI6MCwiaWF0IjoxNjUwNzMwMTc5LCJleHAiOjE2NTA4MTY1Nzl9.GfX0Qih3HI7VfPHV7lkcVM6mcoBXCPW4IOD8o9Y0jRI'
    //     const id = '62642219b34ee94e048c41b2'

    //     const response = await api
    //         .get(`${baseUrl}/${id}`)
    //         .set('Authorization','Bearer' + token)
    //         .expect(200)
    //         .expect('Content-Type', /application\/json/)

    // })

})

afterAll(() => {
    mongoose.connection.close()
    app.close()
})