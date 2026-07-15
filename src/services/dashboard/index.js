import apiClient from 'services/axios'

export async function fetchUserStats() {
  return apiClient
    .get('/stats/users')
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessStats() {
  return apiClient
    .get('/stats/businesses')
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function WalletStatistics() {
  return apiClient
    .get('/stats/wallets')
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
