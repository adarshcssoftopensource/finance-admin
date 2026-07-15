import apiClient from 'services/axios'

// eslint-disable-next-line import/prefer-default-export
export async function fetchAllScheduler() {
  return apiClient
    .get(`scheduler/`)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

export async function addScheduler(data) {
  return apiClient
    .post(`scheduler/`, data)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}

export async function editScheduler({ id, data }) {
  return apiClient
    .put(`scheduler/${id}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}
