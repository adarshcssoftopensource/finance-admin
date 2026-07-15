import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllFundingLinks = async ({ qryString }) => {
  return apiClient
    .get(`/funding/links?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function verifiedUnverifiedBusiness(id, isVerified) {
  return apiClient
    .patch(`/funding/links/${id}`, { isVerified })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
