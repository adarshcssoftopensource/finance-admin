/* eslint-disable */
import apiClient from 'services/axios'

export async function fetchBusinessRewardEarnHistory(businessId, { qryString }) {
  return apiClient
    .get(`rewards/business/${businessId}?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
