import Vue from 'vue'
import Axios from 'axios'

const axiosInstance = Axios.create({
    withCredentials: true
})


axiosInstance.interceptors.request.use((config) => {
    // const token = JSON.parse(localStorage.getItem('token'));
    // if (token) {
    //     //  config.params = {'token':token} 
    //     config.headers.Authorization = token; 
    // }
    //  request.getHeader('token')
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    const regex = /.*csrftoken=([^;.]*).*$/
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1]
    return config
})

axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

Vue.prototype.axios = axiosInstance

export default axiosInstance