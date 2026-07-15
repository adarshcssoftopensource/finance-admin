import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchPushNotifications({ qryString }) {
  return apiClient
    .get(`/notifications${qryString ? `?${qryString}` : ''}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchSinglePushNotification = async id => {
  return apiClient
    .get(`/notifications/${id}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const sendPushNotification = async data => {
  return apiClient
    .post(`/notifications/send`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const addPushNotification = async data => {
  return apiClient
    .post('/notifications', { ...data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const updatePushNotification = async (id, data) => {
  return apiClient
    .put(`/notifications/${id}`, { ...data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const deletePushNotification = async id => {
  return apiClient
    .delete(`/notifications/${id}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
