import axios from 'axios'
import store from 'store'
import { notification } from 'antd'

const getBaseURL = () => {
  const savedURL = localStorage.getItem('API_URL')
  return savedURL || window.API_URL || process.env.REACT_APP_API_URL
}

const baseURL = getBaseURL()

// Store new API URL if it comes from window
if (window.API_URL && window.API_URL !== localStorage.getItem('API_URL')) {
  localStorage.setItem('API_URL', window.API_URL)
}

const apiClientWithBlob = axios.create({
  baseURL,
  responseType: 'arraybuffer',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

apiClientWithBlob.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    //  request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.Authorization = `Bearer ${accessToken}`
  }
  return request
})

apiClientWithBlob.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data && data.message) {
    notification.warning({
      message: data.message,
    })
  }
})

export default apiClientWithBlob
