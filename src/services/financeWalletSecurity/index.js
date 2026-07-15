import apiClient from 'services/axios'

const handleResponse = response => response.data

const handleError = (err, fallback) => {
  console.error(fallback, err)
  return {
    error: true,
    message: err?.response?.data?.message || fallback,
  }
}

function extractAccountRows(envelope) {
  if (Array.isArray(envelope?.data)) return envelope.data
  if (Array.isArray(envelope)) return envelope
  return []
}

function unwrapList(res) {
  const envelope = res?.data ?? res
  const rows = extractAccountRows(envelope)
  return {
    rows,
    pagination: envelope?.pagination || { page: 1, limit: 20, total: rows.length },
  }
}

export async function fetchWalletSecurityUsers({ page = 1, limit = 20, search = '' } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)

  return apiClient
    .get(`/wallet/admin/security/users?${params.toString()}`)
    .then(handleResponse)
    .then(unwrapList)
    .catch(err => handleError(err, 'Error fetching wallet users'))
}

export async function setWalletUserBlock(userId, blocked, reason = '') {
  return apiClient
    .patch(`/wallet/admin/security/users/${userId}/block`, { blocked, reason: reason || undefined })
    .then(handleResponse)
    .catch(err => handleError(err, 'Error updating user block status'))
}

export async function fetchWalletDevices({ page = 1, limit = 20, search = '' } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)

  return apiClient
    .get(`/wallet/admin/security/devices?${params.toString()}`)
    .then(handleResponse)
    .then(unwrapList)
    .catch(err => handleError(err, 'Error fetching wallet devices'))
}

export async function fetchBlockedWalletDevices({ page = 1, limit = 20, search = '' } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (search) params.set('search', search)

  return apiClient
    .get(`/wallet/admin/security/blocked-devices?${params.toString()}`)
    .then(handleResponse)
    .then(unwrapList)
    .catch(err => handleError(err, 'Error fetching blocked devices'))
}

export async function blockWalletDevice(deviceId, reason = '') {
  return apiClient
    .post(`/wallet/admin/security/devices/${encodeURIComponent(deviceId)}/block`, {
      reason: reason || undefined,
    })
    .then(handleResponse)
    .catch(err => handleError(err, 'Error blocking device'))
}

export async function unblockWalletDevice(deviceId) {
  return apiClient
    .post(`/wallet/admin/security/devices/${encodeURIComponent(deviceId)}/unblock`)
    .then(handleResponse)
    .catch(err => handleError(err, 'Error unblocking device'))
}
