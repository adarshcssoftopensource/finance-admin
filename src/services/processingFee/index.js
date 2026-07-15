import apiClient from 'services/axios'
/* eslint-disable */

export async function getProcessingFeeDetails(id) {
  return apiClient
    .get(`/businesses/${id}/fee`, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function businessUpdate(id, data) {
  return apiClient
    .patch(`/businesses/${id}`, data, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function getFeeTemplatesList() {
  return apiClient
    .get(`/fee-templates/`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function getPaymentOnboarding(id) {
  return apiClient
    .get(`/businesses/${id}/legal?step=1`, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
export async function addTemplatesDetails(data) {
  return apiClient
    .post(`/fee-templates/`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function resetProcessingFee(id) {
  return apiClient
    .put(`/businesses/${id}/resetfee`, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
