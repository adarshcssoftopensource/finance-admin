import apiClient from 'services/axios'

export function getAllAssets(queryString) {
  return apiClient
    .get(`/assetsManagements?${queryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export function uploadAssets(file) {
  return apiClient
    .post('/assetsManagements/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export function removeAssets(payload) {
  return apiClient
    .post('/assetsManagements/remove', payload)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
