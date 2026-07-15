import apiClient from 'services/axios'

export async function fetchAllRewardTemplates({ qryString }) {
  return apiClient
    .get(`rewards/templates?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchRewardTemplate(templateId) {
  return apiClient
    .get(`rewards/templates/${templateId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function editRewardTemplate(templateId, data) {
  return apiClient
    .patch(`rewards/templates/${templateId}`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
