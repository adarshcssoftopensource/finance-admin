import apiClient from 'services/axios'

export async function fetchAllBanner({ qryString }) {
  return apiClient
    .get(`banner/?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBannerById(bannerId) {
  return apiClient
    .get(`banner/${bannerId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchAllBannerTargets({ qryString }) {
  return apiClient
    .get(`banner-targets/?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addBanner(data) {
  return apiClient
    .post(`banner/`, { bannerInput: data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addBannerTarget(data) {
  return apiClient
    .post(`banner-targets/`, { ...data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function editBanner(bannerId, data) {
  return apiClient
    .put(`banner/${bannerId}`, { bannerInput: data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function editBannerTarget(bannerTargetId, data) {
  return apiClient
    .patch(`banner-targets/${bannerTargetId}`, { ...data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBanner({ bannerId }) {
  return apiClient
    .get(`banner/${bannerId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function deleteBanner({ bannerId }) {
  return apiClient
    .get(`banner/${bannerId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
