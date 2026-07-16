import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://leetcodeproject-backend.onrender.com/',
    withCredentials: true,//this is used to pass to cookies 
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

