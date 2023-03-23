import axios from 'axios'

// axios.defaults.baseURL = 'https://wayne-af-moments.herokuapp.com/'
axios.defaults.baseURL = 'https://wayne-af-drf-api.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true

// Axios instances that we'll attach interceptors to.
// One to intercept request and one to intercept response.
export const axiosReq = axios.create()
export const axiosRes = axios.create()