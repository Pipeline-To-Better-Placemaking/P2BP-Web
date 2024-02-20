//.env will not be published to github.  Access to keys can be found in dashboard of heroku application
require('dotenv').config()

let PORT = process.env.POR
let DB_URI = process.env.DB_URI
let PRIVATE_KEY = process.env.PRIVATE_KEY
let PROJECT_EMAIL = process.env.PROJECT_EMAIL
let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let REFRESH_TOKEN = process.env.REFRESH_TOKEN
let ACCESS_TOKEN = process.env.ACCESS_TOKEN
let GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY
let TEST_DB_URI = process.env.TEST_DB_URI
let JEST_TEST_URI = process.env.JEST_TEST_URI

console.log("NODE ENV");
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'dev') {
	DB_URI = process.env.TEST_DB_URI
    PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
}

if (process.env.NODE_ENV === 'test') {
	DB_URI = process.env.JEST_TEST_URI
    PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
}

console.log("FUCKING KEY");
console.log(PRIVATE_KEY);

module.exports = {
    PORT,
    DB_URI,
    PRIVATE_KEY,
    PROJECT_EMAIL,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    ACCESS_TOKEN,
    GOOGLE_MAP_KEY,
    TEST_DB_URI,
    JEST_TEST_URI
}