import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllPayouts = async ({ qryString }) => {
  return apiClient
    .get(`payouts?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchPayoutDetails = async ({ payoutId }) => {
  return apiClient
    .get(`payouts/${payoutId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
