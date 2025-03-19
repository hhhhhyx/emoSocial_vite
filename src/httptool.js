import axios from "axios";

const httptool = axios.create({
    baseURL: 'http://localhost:80/', 
    timeout: 1000,  
    headers: {}  
});


httptool.interceptors.request.use((config) => {
    console.log("Before http request");
    return config;
}, (error) => {
    console.log("http request error");
    return Promise.reject(error);
});


httptool.interceptors.response.use((response) => {
    console.log("After the server responds successfully to the data, the first time the result is returned to the client, before the execution of then");
    return response;
}, (error) => {
    console.log("When the server responds with error content...")
    return Promise.reject(error);
});

export default httptool;