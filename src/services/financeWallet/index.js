import apiClient from 'services/axios'
/* eslint-disable */

const handleWalletResponse = response => response.data

const handleWalletError = (err, fallback) => {
  console.error(fallback, err)
  return {
    error: true,
    message: err?.response?.data?.message || fallback,
  }
}

export async function fetchFinanceWalletStats() {
  return apiClient
    .get('/wallet/admin/stats')
    .then(handleWalletResponse)
    .catch(err => handleWalletError(err, 'Error fetching wallet stats'))
}

export async function fetchFinanceWalletSignups({ page = 1, limit = 20, search = '' } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)

  return apiClient
    .get(`/wallet/admin/signups?${params.toString()}`)
    .then(handleWalletResponse)
    .catch(err => handleWalletError(err, 'Error fetching wallet signups'))
}

export async function fetchAllFinanceWallets({
  page = 1,
  limit = 20,
  search = '',
  status = '',
} = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)
  if (status) params.set('status', status)

  return apiClient
    .get(`/wallet/admin/all?${params.toString()}`)
    .then(handleWalletResponse)
    .catch(err => handleWalletError(err, 'Error fetching wallets'))
}

export async function fetchAllWalletTransactionsAdmin({
  page = 1,
  limit = 20,
  search = '',
  transaction_type = '',
  method = '',
  status = '',
  startDate = '',
  endDate = '',
} = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)
  if (transaction_type) params.set('transaction_type', transaction_type)
  if (method) params.set('method', method)
  if (status) params.set('status', status)
  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)

  return apiClient
    .get(`/transaction/admin/all?${params.toString()}`)
    .then(handleWalletResponse)
    .catch(err => handleWalletError(err, 'Error fetching transactions'))
}
