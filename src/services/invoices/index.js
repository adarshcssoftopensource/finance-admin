import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllBadInvoices = async ({ qryString }) => {
  return apiClient
    .get(`invoices/?type=bad-data&${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchAllInvoices = async ({ qryString }) => {
  return apiClient
    .get(`invoices/?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchInvoiceDetails = async ({ invoiceId, businessId }) => {
  return apiClient
    .get(`invoices/${invoiceId}/${businessId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
