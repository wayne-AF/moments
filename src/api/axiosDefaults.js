import axios from 'axios'

// axios.defaults.baseURL = 'https://wayne-af-moments.herokuapp.com/'
axios.defaults.baseURL = 'https://wayne-af-drf-api.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true