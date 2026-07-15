import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchUserDevices({ qryString }) {
  return apiClient
    .get(`/devices?${qryString || ''}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateUserDevice(deviceId, status) {
  return apiClient
    .patch(`/devices/${deviceId}`, { status })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function deleteUserDevice(deviceId) {
  return apiClient
    .delete(`/devices/${deviceId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
