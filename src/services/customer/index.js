import apiClient from 'services/axios'

export const blockCustomerGlobally = async customerId => {
  try {
    const response = await apiClient.post('/customers/block-global', { customerId })
    return {
      statusCode: response.status,
      message: response.data.message || 'Customer blocked successfully',
      data: response.data.data || {},
    }
  } catch (err) {
    return {
      statusCode: err?.response?.status || 500,
      message: err?.response?.data?.message || 'Failed to block customer',
      data: {},
    }
  }
}

export const unblockCustomerGlobally = async customerId => {
  try {
    const response = await apiClient.post('/customers/unblock-global', { customerId })
    return {
      statusCode: response.status,
      message: response.data.message || 'Customer unblocked successfully',
      data: response.data.data || {},
    }
  } catch (err) {
    return {
      statusCode: err?.response?.status || 500,
      message: err?.response?.data?.message || 'Failed to unblock customer',
      data: {},
    }
  }
}
