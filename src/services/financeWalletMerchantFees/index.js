import apiClient from 'services/axios'

const handleResponse = response => response.data

const handleError = (err, fallback) => {
  console.error(fallback, err)
  return {
    error: true,
    message: err?.response?.data?.message || fallback,
  }
}

export async function fetchMerchantFeeTiers() {
  return apiClient
    .get('/wallet/admin/merchant-fee-tiers')
    .then(handleResponse)
    .catch(err => handleError(err, 'Error fetching merchant fee tiers'))
}

export async function fetchBusinessAccounts({
  page = 1,
  limit = 20,
  search = '',
  riskTier = '',
} = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)
  if (riskTier) params.set('riskTier', riskTier)

  return apiClient
    .get(`/wallet/admin/business-accounts?${params.toString()}`)
    .then(handleResponse)
    .catch(err => handleError(err, 'Error fetching business accounts'))
}

export async function updateBusinessRiskTier(userId, riskTier) {
  return apiClient
    .patch(`/wallet/admin/business-accounts/${userId}/risk-tier`, { riskTier })
    .then(handleResponse)
    .catch(err => handleError(err, 'Error updating risk tier'))
}
