import axios from 'axios'
import store from 'store'
import jwt from 'jsonwebtoken'
import { notification } from 'antd'

const apiGatewayClient = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiGatewayClient.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    const body = {
      user: {
        _id: request.userId,
        businessIds: [request.businessId],
        selectedBusinessId: request.businessId,
      },
    }
    request.headers.Authorization = `Bearer ${jwt.sign(
      { type: 'accessToken', data: body },
      process.env.REACT_APP_EVENT_JWT_SECRET,
    )}`
  }
  return request
})

apiGatewayClient.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data && data.message) {
    notification.warning({
      message: data.message,
    })
  }
})

export default apiGatewayClient
