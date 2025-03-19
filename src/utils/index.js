import axios from 'axios';
import router from "../router/index.js";

axios.defaults.withCredentials = true;

const http = axios.create({
    withCredentials: true, 
    baseURL: '', 
    timeout: 5000,
});


async function checkTokenExpiration() {
    return new Promise((resolve, reject) => {
        
        let authorization = localStorage.getItem("token");

        if (authorization) {
            resolve();
        } else {
            reject();
        }
    });
}






export default http;
