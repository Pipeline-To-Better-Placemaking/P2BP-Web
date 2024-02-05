const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const Project = require('../models/projects')
const User = require('../models/users')


const baseUrl = '/api/projects'

var testUser = {
    firstname: 'Andrea',
    lastname: 'Test',
    email: 'andreatesting2@aol.com',
    password: 'testing12Andrea!'
}

const mockObjectId = new mongoose.Types.ObjectId();
const teamId = new mongoose.Types.ObjectId('63dd7f0ce430a91b9bc425e7');
const standingPointsId = new mongoose.Types.ObjectId('6265d737dc628b7c7ae00c80')
const areaId = new mongoose.Types.ObjectId('6265dfabdc628b7c7ae00c81')


describe('When creating a project', () => {

    //  beforeEach(async () => {
    //      // Begin each test with a known user record in the database

    //       //await User.deleteMany({})
    //       const user = new User({
    //           firstname: testUser.firstname,
    //           lastname: testUser.lastname,
    //           institution: testUser.institution,
    //           email: testUser.email,
    //           password: testUser.password
    //       })
    //       await User.addUser(user)
    //       token = th.getToken(user)
    //       console.log(token)
        
    //  })
    
    test('Creation succeeds', async () => {

       //points is an object array of lat and long
       //standingpoints is an array of lat, long, and title
       //they are not the same.
       
       const area = new Array(2).fill({
            longitude: -81.19861073791981,
            latitude: 28.60323859747802
        })
       

       const standingPoints = new Array(1).fill({
           longitude:-81.19861073791981,
           latitude:28.60323859747802,
           title: 'circle'
       }) 

       testUser = await User.findUserByEmail('andreatesting2@aol.com')
        
        token = th.getToken(testUser)
        console.log(token)

        const testProj = {
            title: 'Andrea Test project',
            description: 'testing the tester',
            points: area,
            standingPoints: standingPoints,
            team: teamId,
            user: testUser
        }

        const response = await api
            .post(`${baseUrl}`)
            .set('Authorization', 'Bearer ' + token)
            .send(testProj)
            // Confirm successful login
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        console.log(response)
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