import apiClient from 'services/axios'

export async function fetchAllDisputes({ qryString }) {
  return apiClient
    .get(`disputes?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchDispute(disputeId) {
  return apiClient
    .get(`disputes/${disputeId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchDisputeDocuments() {
  return apiClient
    .get(`disputes/documents`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function manageDispute(disputeId, data) {
  return apiClient
    .patch(`disputes/${disputeId}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
