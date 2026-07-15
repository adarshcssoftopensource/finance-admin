import apiClient from 'services/axios'
/* eslint-disable */

const getBaseURL = () => {
  const savedURL = localStorage.getItem('API_URL')
  return savedURL || window.API_URL || process.env.REACT_APP_API_URL
}

const baseURL = getBaseURL()

// Store new API URL if it comes from window
if (window.API_URL && window.API_URL !== localStorage.getItem('API_URL')) {
  localStorage.setItem('API_URL', window.API_URL)
}

const url = baseURL.replace(/admin/g, '')

export async function fetchCurrency() {
  return apiClient
    .get(`${url}utility/public/currencies`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function fetchCountry() {
  return apiClient
    .get(`${url}utility/public/countries`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}
