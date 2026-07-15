import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchAllWalletLedger({ qryString }) {
  return apiClient
    .get(`wallet-ledger/ledger?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchLedgerSummary() {
  return apiClient
    .get(`wallet-ledger/ledger/summary`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addAmount(data) {
  return apiClient
    .post(`wallet-ledger/issuing`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
