import apiClient from 'services/axios'

export async function createSalesAgent(payload) {
  return apiClient
    .post('agent/sales-agent', payload)
    .then(response => response.data)
    .catch(err => {
      console.error('Create Sales Agent failed', err)
      throw err
    })
}

export async function assumeAgent(agentId) {
  return apiClient
    .post(`agent/assume/${agentId}`)
    .then(response => response.data)
    .catch(err => {
      console.error('Assume Agent failed', err)
      throw err
    })
}

export async function assignSalesAgentToBusiness(agentId, businessId) {
  if (!agentId || !businessId) {
    throw new Error('Agent ID and Business ID are required')
  }

  return apiClient
    .post(`agent/sales-agent/${agentId}/assign/${businessId}`)
    .then(response => response.data)
    .catch(err => {
      console.error('Assign Sales Agent failed', err)
      throw err
    })
}

export async function updateSalesAgent(agentId, payload) {
  return apiClient
    .put(`agent/sales-agent/${agentId}`, payload)
    .then(response => response.data)
    .catch(err => {
      console.error('Update Sales Agent failed', err)
      throw err
    })
}

export async function getAllSalesAgents() {
  return apiClient
    .get('agent/sales-agent')
    .then(response => response.data)
    .catch(err => {
      console.error('Get All Sales Agents failed', err)
      throw err
    })
}

export async function deleteSalesAgent(agentId) {
  return apiClient
    .delete(`agent/sales-agent/${agentId}`)
    .then(response => response.data)
    .catch(err => {
      console.error('Delete Sales Agent failed', err)
      throw err
    })
}

export async function removeMerchantFromAgent(agentId, businessId) {
  return apiClient
    .delete(`agent/sales-agent/${agentId}/merchant/${businessId}`)
    .then(response => response.data)
    .catch(err => {
      console.error('Remove Merchant From Agent failed', err)
      throw err
    })
}

export async function getSalesAgentsByBusinessId(businessId) {
  if (!businessId) throw new Error('Business ID is required')

  return apiClient
    .get(`agent/sales-agent/${businessId}`)
    .then(response => response.data)
    .catch(err => {
      console.error('Get Sales Agents by Business failed', err)
      throw err
    })
}

export async function getSalesAgentById(id) {
  const response = await apiClient.get(`agent/sales-agent/${id}`)
  return response.data
}

export async function logAgentPayout(agentId, payload) {
  return apiClient
    .post(`agent/${agentId}/payouts`, payload)
    .then(response => response.data)
    .catch(err => {
      console.error('Log Agent Payout failed', err)
      throw err
    })
}

export async function getAgentPayouts(agentId) {
  return apiClient
    .get(`agent/${agentId}/payouts`)
    .then(response => response.data)
    .catch(err => {
      console.error('Get Agent Payouts failed', err)
      throw err
    })
}
