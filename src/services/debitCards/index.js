import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllDebitCards = async ({ qryString }) => {
  return apiClient
    .get(`debit-cards?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchAllDebitCardDetails = async ({ walletId }) => {
  return apiClient
    .get(`debit-cards/${walletId}/cards`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchAllWalletTransactions = async qryString => {
  return apiClient
    .get(`debit-cards/debitCard/transactions?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const changeDebitCardStatus = async (debitCardId, status) => {
  return apiClient
    .patch(`debit-cards/${debitCardId}/changeStatus`, { status })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const changeDebitCardWalletStatus = async (walletId, status) => {
  return apiClient
    .patch(`debit-cards/${walletId}/wallet`, { status })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const replaceOrCancelDebitCard = async (debitCardId, businessId, status) => {
  return apiClient
    .patch(`debit-cards/${debitCardId}`, { businessId, status })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const deleteDebitCardWallet = async (walletId, remarks) => {
  return apiClient
    .patch(`debit-cards/${walletId}/delete`, { remarks })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const generateDebitCard = async data => {
  return apiClient
    .post(`debit-cards`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const getShippingAddressData = async id => {
  return apiClient
    .get(`businesses/${id}/legals`, { params: { businessId: id } })
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export const getStateByCountryId = async id => {
  return apiClient
    .get(`utility/public/countries/${id}`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export const getAllCountry = async () => {
  return apiClient
    .get(`utility/public/countries`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export const changeBulkDebitCardStatus = async data => {
  return apiClient
    .patch(`debit-cards/update-bulk-status`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
