const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const th = require('./test_helper')
const Stationary_Maps = require('../models/stationary_maps')
const User = require('../models/users')


const baseUrl = '/api/stationary_maps'

const testUser = {
    firstname: 'Ron',
    lastname: 'Doe',
    email: 'testdfdafarooo@yahoo.com',
    password: '1#Aadmin'
}

const mockObjectId = new mongoose.Types.ObjectId();

const points = [mongoose.Types.ObjectId('6265d737dc628b7c7ae00c80')]
points.push(mongoose.Types.ObjectId('629a0847a60fdf94b0656b82'))
points.push(mongoose.Types.ObjectId('629a09dca60fdf94b0656b83'))

const researchers = [mongoose.Types.ObjectId('629a1597f6b78f2e4489e2ec')]
const testMap = {
    title: 'StationaryMap',
    standingPoints: points,
    // researchers: researchers,
    // project: mongoose.Types.ObjectId('629a1597f6b78f2e4489e2ec'),
    // sharedData: mongoose.Types.ObjectId('629a1597f6b78f2e4489e2ec'),
    date: '04/23/2022',
    maxResearchers: 1
}


describe('When creating a map', () => {

    // beforeEach(async () => {
    //     // Begin each test with a known user record in the database

    //     // await User.deleteMany({})
    //     // const user = new User({
    //     //     firstname: testUser.firstname,
    //     //     lastname: testUser.lastname,
    //     //     institution: testUser.institution,
    //     //     email: testUser.email,
    //     //     password: testUser.password
    //     // })
    //     // await User.addUser(user)
    //     // token = th.getToken(user)
    //     // console.log(token)

    //     const map = new Stationary_Maps({
    //         title: testMap.title,
    //         standingPoints: testMap.standingPoints,
    //         researchers: testMap.researchers,
    //         project: testMap.project,
    //         sharedData: testMap.sharedData,
    //         date: testMap.date,
    //         maxResearchers: testMap.maxResearchers
    //     })
    //     await Stationary_Maps.addMap(map)
    // })
    
    // test('Creation succeeds', async () => {
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc192ZXJpZmllZCI6ZmFsc2UsImludml0ZXMiOltdLCJ0ZWFtcyI6W10sIl9pZCI6IjYyOWEwZmUzMzk3NTlkNGNjY2ViZDA3NiIsImZpcnN0bmFtZSI6IlJvbiIsImxhc3RuYW1lIjoiRG9lIiwiZW1haWwiOiJ0ZXN0ZGZkYWZhcm9vb0B5YWhvby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRRN0duUnBFRC5WT3NXNi9yVTZWTGJlc0xDTXJqZVdaeXZlT2pUUU1VNUR5dmJQWTRReWZpaSIsIl9fdiI6MCwiaWF0IjoxNjU0MjYzNzc5LCJleHAiOjE2NTQzNTAxNzl9.tJ_LiV26Ufd7vKF5-vVI_nx1rtSFmvmf_8WsQvJlwt8'

    //     const response = await api
    //         .post(`${baseUrl}`)
    //         .set('Authorization', 'Bearer ' + token)
    //         .send(testMap)
    //         // Confirm successful login
    //         .expect(200)
    //         .expect('Content-Type', /application\/json/)
    // })

    //     // Confirm that response contains email
    //     // expect(response.body).toMatchObject({ user: { email: testUser.email } })
        
    //     // // Confirm that response contains authorization token
    //     // expect(response.body.token)

    //     // // Confirm that the token is accurate
    //     // const payload = th.decodeToken(response.body.token)
    //     // expect(payload.email).toBeDefined()
    //     // expect(payload.email).toMatch(testUser.email)
    // })

    // test('Get map created', async () => {
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc192ZXJpZmllZCI6ZmFsc2UsImludml0ZXMiOltdLCJ0ZWFtcyI6W10sIl9pZCI6IjYyOWEwZmUzMzk3NTlkNGNjY2ViZDA3NiIsImZpcnN0bmFtZSI6IlJvbiIsImxhc3RuYW1lIjoiRG9lIiwiZW1haWwiOiJ0ZXN0ZGZkYWZhcm9vb0B5YWhvby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRRN0duUnBFRC5WT3NXNi9yVTZWTGJlc0xDTXJqZVdaeXZlT2pUUU1VNUR5dmJQWTRReWZpaSIsIl9fdiI6MCwiaWF0IjoxNjU0MjYzNzc5LCJleHAiOjE2NTQzNTAxNzl9.tJ_LiV26Ufd7vKF5-vVI_nx1rtSFmvmf_8WsQvJlwt8'
    //     const id = '629a1597f6b78f2e4489e2ed'

    //     const response = await api
    //         .get(`${baseUrl}/${id}`)
    //         .set('Authorization',`Bearer ${token}`)
    //         .expect(200)
    //         .expect('Content-Type', /application\/json/)

    // })

    test('Update Map', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc192ZXJpZmllZCI6ZmFsc2UsImludml0ZXMiOltdLCJ0ZWFtcyI6W10sIl9pZCI6IjYyOWEwZmUzMzk3NTlkNGNjY2ViZDA3NiIsImZpcnN0bmFtZSI6IlJvbiIsImxhc3RuYW1lIjoiRG9lIiwiZW1haWwiOiJ0ZXN0ZGZkYWZhcm9vb0B5YWhvby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRRN0duUnBFRC5WT3NXNi9yVTZWTGJlc0xDTXJqZVdaeXZlT2pUUU1VNUR5dmJQWTRReWZpaSIsIl9fdiI6MCwiaWF0IjoxNjU0MjYzNzc5LCJleHAiOjE2NTQzNTAxNzl9.tJ_LiV26Ufd7vKF5-vVI_nx1rtSFmvmf_8WsQvJlwt8'
        const id = '629a1597f6b78f2e4489e2ed'

        const response = await api
            .put(`${baseUrl}/${id}`)
            .set('Authorization',`Bearer ${token}`)
            .send(testMap)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })

})

afterAll(() => {
    mongoose.connection.close()
    app.close()
})