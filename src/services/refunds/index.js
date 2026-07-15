import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllRefunds = async ({ qryString }) => {
  return apiClient
    .get(`refunds?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const createRefund = async payload => {
  return apiClient
    .post('refunds', payload)
    .then(response => {
      return {
        success: response.status >= 200 && response.status < 300,
        data: response.data.data || {},
        message: response.data.message || 'Refund submitted successfully',
      }
    })
    .catch(err => {
      return {
        success: false,
        message: err?.response?.data?.message || 'Something went wrong',
        data: {},
      }
    })
}

export const fetchRefundDetails = async ({ refundId }) => {
  return apiClient
    .get(`refunds/${refundId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
