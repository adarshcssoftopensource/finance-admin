import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchDocuments({ qryString }) {
  return apiClient
    .get(`/verification-center?${qryString || ''}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function requestDocument(businessId, body) {
  return apiClient
    .post(`/verification-center/${businessId}`, body)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function proceedWithSubmittedDocument(businessId, status) {
  return apiClient
    .patch(`/verification-center/${businessId}`, { status })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
