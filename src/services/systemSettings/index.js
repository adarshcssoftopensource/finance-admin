import apiClient from 'services/axios'

export async function getAllSettings() {
  return apiClient
    .get('/feature-flag')
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateAllSettings(data) {
  return apiClient
    .patch('/feature-flag', data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function deleteSettings(deleteUrl) {
  return apiClient
    .delete(`/feature-flag/${deleteUrl}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
