import axios from 'axios';

// do not change this to localhost when pushing to the branch
export default axios.create({
    baseURL: 'https://better-placemaking.web.app/api'
});
