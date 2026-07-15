import apiClient from '../axios'

export async function getCustomFilter() {
  return apiClient
    .get(`/crm/users/filter`)
    .then(response => {
      if (response) {
        return response.data
      }
      return {}
    })
    .catch(err => console.log(err))
}

export async function applyFilter(data, querystring) {
  return apiClient
    .post(`crm/users?${querystring}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function sendText(payload) {
  return apiClient
    .post(`crm/users/communicate/text`, payload)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
