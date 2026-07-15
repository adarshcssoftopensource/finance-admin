import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchCountries({ qryString }) {
  return apiClient
    .get(`/countries?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchCountryFeesByCountryId(countryId) {
  return apiClient
    .get(`/countries/${countryId}/fees`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateCountryFees(countryId, data) {
  return apiClient
    .patch(`/countries/${countryId}/fees`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addCountries(data) {
  return apiClient
    .post(`/countries/`, data)
    .then(response => {
      if (response) {
        return response.data
      } else {
        return {}
      }
    })
    .catch(err => console.log(err))
}

export async function updateCountry(id, data) {
  return apiClient
    .patch(`/countries/${id}`, data)
    .then(response => {
      if (response) {
        return response.data
      } else {
        return {}
      }
    })
    .catch(err => console.log(err))
}

export async function fetchOnboardingSchema() {
  return apiClient
    .get(`/countries/onboardingschema`)
    .then(response => {
      if (response) {
        return response.data
      } else {
        return {}
      }
    })
    .catch(err => console.log(err))
}
