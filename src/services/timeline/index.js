import apiClient from 'services/axios'
/* eslint-disable */
export const getTimeLine = async (entityId, businessId, userId) => {
  return apiClient
    .get(`/event-service/external/${entityId}`, { businessId, userId })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
