import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,//this is used to pass to cookies 
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

