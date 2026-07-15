import axios from 'axios'
import store from 'store'
import { applyStaticAdapter } from './staticAdapter'

const getBaseURL = () => {
  try {
    localStorage.removeItem('API_URL')
  } catch (e) {
    // ignore
  }
  return window.API_URL || process.env.REACT_APP_API_URL || ''
}

const apiClient = axios.create({
  baseURL: getBaseURL(),
})

apiClient.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    if (request?.params?.businessId) {
      request.headers['x-business-id'] = request?.params?.businessId
      delete request?.params?.businessId
    }
  }
  return request
})

apiClient.interceptors.response.use(undefined, error => {
  // Static demo: do not redirect on API errors
  return Promise.reject(error)
})

applyStaticAdapter(apiClient)

export default apiClient
