import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllCheckouts = async ({ qryString }) => {
  return apiClient
    .get(`checkouts/?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchCheckoutDetails = async ({ checkoutId, businessId }) => {
  return apiClient
    .get(`checkouts/${checkoutId}/${businessId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
