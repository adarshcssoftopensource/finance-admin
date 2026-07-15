import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllPeyme = async ({ qryString }) => {
  return apiClient
    .get(`peyme?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function verifiedUnverifiedBusiness(id, isVerified) {
  return apiClient
    .patch(`peyme/${id}`, { isVerified })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
