import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllDownloads = async ({ qryString }) => {
  return apiClient
    .get(`/downloads/?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const deleteSingleDownload = async ({ id }) => {
  return apiClient
    .delete(`/downloads/${id}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
