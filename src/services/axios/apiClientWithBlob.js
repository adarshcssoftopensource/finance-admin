import axios from 'axios'
import store from 'store'
import { notification } from 'antd'
import { applyStaticAdapter } from './staticAdapter'

const getBaseURL = () => {
  return window.API_URL || process.env.REACT_APP_API_URL || ''
}

const apiClientWithBlob = axios.create({
  baseURL: getBaseURL(),
  responseType: 'arraybuffer',
})

apiClientWithBlob.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }
  return request
})

apiClientWithBlob.interceptors.response.use(undefined, error => {
  const { response } = error
  if (response?.data?.message) {
    notification.warning({
      message: response.data.message,
    })
  }
  return Promise.reject(error)
})

applyStaticAdapter(apiClientWithBlob, { isBlob: true })

export default apiClientWithBlob
