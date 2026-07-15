import apiClient from 'services/axios'
/* eslint-disable */
export const fetchPayoutChangeRequests = async ({ qryString }) => {
  return apiClient
    .get(`payouts/requests?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchPayoutChangeRequest = async ({ requestId }) => {
  return apiClient
    .get(`payouts/requests/${requestId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const changePayoutRequestStatus = async (requestId, data) => {
  return apiClient
    .patch(`payouts/requests/${requestId}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
