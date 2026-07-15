import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllRequests = async ({ qryString }) => {
  return apiClient
    .get(`requests?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchSingleRequest = async ({ requestId }) => {
  return apiClient
    .get(`requests/${requestId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const updateRequestMessage = async (requestId, message) => {
  return apiClient
    .patch(`requests/${requestId}/message`, { message })
    .then(response => response.data)
    .catch(err => console.log(err))
}

export const changeRequestStatus = async (requestId, data) => {
  return apiClient
    .patch(`requests/${requestId}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const bulkChangeRequestStatus = async data => {
  return apiClient
    .patch(`requests/bulkUpdate`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
