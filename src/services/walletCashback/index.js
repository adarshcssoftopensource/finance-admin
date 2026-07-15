import apiClient from 'services/axios'

const handleResponse = response => response.data

export async function fetchCashbackOverview() {
  return apiClient.get('/wallet-cashback/overview').then(handleResponse)
}

export async function updatePlatformCashback(payload) {
  return apiClient.patch('/wallet-cashback/platform', payload).then(handleResponse)
}

export async function upsertMerchantCashback(payload) {
  return apiClient.put('/wallet-cashback/merchant', payload).then(handleResponse)
}

export async function deleteMerchantCashback(businessId) {
  return apiClient.delete(`/wallet-cashback/merchant/${businessId}`).then(handleResponse)
}

export async function createCashbackPromotion(payload) {
  return apiClient.post('/wallet-cashback/promotions', payload).then(handleResponse)
}

export async function updateCashbackPromotion(promotionId, payload) {
  return apiClient.patch(`/wallet-cashback/promotions/${promotionId}`, payload).then(handleResponse)
}

export async function deleteCashbackPromotion(promotionId) {
  return apiClient.delete(`/wallet-cashback/promotions/${promotionId}`).then(handleResponse)
}
