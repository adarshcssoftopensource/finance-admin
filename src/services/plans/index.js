import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchAllPlans() {
  return apiClient
    .get(`plans`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updatePlans(planId, data) {
  return apiClient
    .patch(`plans/${planId}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
