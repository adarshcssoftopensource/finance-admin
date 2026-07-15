import apiClient from 'services/axios'

export async function fetchAllBusiness({ qryString }) {
  return apiClient
    .get(`${process.env.REACT_APP_API_URL}/businesses?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchAllOnboardingReviewBusiness({ qryString }) {
  return apiClient
    .get(`businesses/onboardingreview?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessDetails({ businessId }) {
  return apiClient
    .get(`businesses/${businessId}`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function activeDeactivaeBusiness(businessId, isActive) {
  return apiClient
    .patch(`businesses/${businessId}`, { isActive }, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateBusiness(businessId, data) {
  return apiClient
    .patch(`businesses/${businessId}`, data, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateBusinessDetail(businessId, payload) {
  if (!payload || typeof payload !== 'object') {
    console.error('Payload object is required')
    return null
  }

  return apiClient
    .patch(`businesses/${businessId}/details`, payload, { params: { businessId } })
    .then(response => response.data)
    .catch(err => {
      console.error('Failed to update business details:', err)
      return null
    })
}

export async function addBusinessNotes(businessId, notes) {
  return apiClient
    .put(`businesses/${businessId}/notes`, notes, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function activeDeactiveUsers(isActive, businessId, userId) {
  return apiClient
    .patch(`businesses/${businessId}/users/${userId}`, { isActive }, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function toggleOnboarding(businessId, reqBody) {
  return apiClient
    .patch(`businesses/${businessId}/allow-onboarding`, reqBody, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function forceUpdatePassword(businessId) {
  return apiClient
    .patch(`businesses/${businessId}/forcepasswordchange`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function getPaymentReceiveds(businessId, qryString) {
  return apiClient
    .get(`businesses/${businessId}/payment?${qryString}`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function sendPromotionalEmails(data) {
  return apiClient
    .post(`businesses/promotional/email`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function removeMerchantFromBusiness(businessId, merchantId) {
  if (!businessId || !merchantId) {
    console.error('Both businessId and merchantId are required')
    return null
  }

  return apiClient
    .delete(`businesses/${businessId}/merchant/${merchantId}`, {
      params: { businessId, merchantId },
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error('Failed to remove merchant ID:', err)
      return null
    })
}

export async function deleteStripeAccount(businessId) {
  return apiClient
    .delete(`businesses/stripe/${businessId}`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function generatePassword(userId) {
  return apiClient
    .get(`businesses/generate-password/${userId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function changeStatementDescriptor(businessId, displayName) {
  return apiClient
    .patch(`businesses/${businessId}/legals`, displayName, { params: { businessId } })
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function updateBusinessLegals(businessId, data) {
  return apiClient
    .patch(`businesses/${businessId}/legals`, data, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function syncStripeAccount(businessId) {
  return apiClient
    .patch(`businesses/${businessId}/sync`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessByName(qryString) {
  return apiClient
    .get(`businesses/searchByName?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function cloneBusiness(businessId, cloneBusinessId, legalName, statementDescriptor) {
  return apiClient
    .patch(
      `businesses/${businessId}/clone`,
      { cloneBusinessId, legalName, statementDescriptor },
      { params: { businessId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function restrictBusiness(data) {
  return apiClient
    .put(`businesses/restrict`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchPaymentOnboardingSteps = (step, id) => {
  return apiClient
    .get(`businesses/${id}/onboarding?step=${step}`, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const onboardingDataSubmit = (data, id) => {
  return apiClient
    .post(`businesses/${id}/onboarding`, data, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const updateOnboardingDataStatus = (status, id, remarks, isPayByBank, providers) => {
  return apiClient
    .patch(
      `businesses/${id}/onboarding`,
      { status, remarks, isPayByBank, providers },
      { params: { businessId: id } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const bulkBlockOnboardingBusiness = (status, businessIds) => {
  return apiClient
    .patch(`businesses/onboarding/bulk-block`, { status, businessIds })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function manageBusinessCapabilities(businessId, capabilityType, status) {
  return apiClient
    .patch(
      `businesses/${businessId}/capabilities`,
      { capabilityType, status },
      { params: { businessId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessCapabilities(businessId) {
  return apiClient
    .get(`businesses/${businessId}/capabilities`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessPaymentSettings(businessId) {
  return apiClient
    .get(`businesses/${businessId}/paymentSettings`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateBusinessPaymentSettings(businessId, data) {
  return apiClient
    .patch(`businesses/${businessId}/paymentSettings`, { ...data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function adjustRewardPoints(businessId, data) {
  return apiClient
    .post(`rewards/business/${businessId}`, data, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessCredits(businessId) {
  return apiClient
    .get(`rewards/business/${businessId}/credits`)
    .then(response => response.data)
    .catch(err => {
      console.log(err)
      throw err
    })
}

export async function addBusinessCredits(businessId, data) {
  return apiClient
    .post(`rewards/business/${businessId}/credits`, data)
    .then(response => response.data)
    .catch(err => {
      console.log(err)
      throw err
    })
}

export async function manageBusinessProvider(businessId, isLinked, providerName) {
  return apiClient
    .patch(
      `businesses/${businessId}/providers`,
      { isLinked, providerName },
      { params: { businessId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function migrateDataFromPeymynt(data) {
  return apiClient
    .post(`businesses/migrate-to-new-db`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchWebhookLogs(query) {
  return apiClient
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}/api/v1/webhooks/stripe/webhook-logs?${query}`)
    .then(response => response.data)
    .catch(err => {
      console.error('Failed to fetch webhook logs:', err)
      return { success: false, logs: [] }
    })
}

export async function fetchErrorLogs(query) {
  return apiClient
    .get(
      `${process.env.REACT_APP_API_GATEWAY_URL}/api/v1/webhooks/stripe/webhook-error-logs?${query}`,
    )

    .then(response => response.data)
    .catch(err => {
      console.error('Failed to fetch error logs:', err)
      return { success: false, logs: [] }
    })
}

export async function updateBusinessPayoutFrequency(businessId, data) {
  return apiClient
    .patch(`businesses/${businessId}/payout-frequency`, { ...data }, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addUserToBusiness(businessId, data) {
  return apiClient
    .post(`businesses/${businessId}/users`, data, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function removeUserFromBusiness(businessId, userBusinessId) {
  return apiClient
    .delete(`businesses/${businessId}/users/${userBusinessId}`, {
      params: { businessId, userBusinessId },
    })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchRoles() {
  return apiClient
    .get('utility/roles')
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function toggleStripeAccount(businessId, merchantId, status) {
  return apiClient
    .patch(
      `businesses/${businessId}/stripe-accounts/${merchantId}/toggle`,
      { status },
      { params: { businessId, merchantId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function performTransferReversal(stripeAccountId, amount) {
  return apiClient
    .post(`businesses/stripe-reversal`, { stripeAccountId, amount })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addStripeAccount(businessId, merchantId) {
  return apiClient
    .post(`businesses/${businessId}/merchant`, { merchantId })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
      return err.response?.data || { error: true, message: 'Something went wrong' }
    })
}
