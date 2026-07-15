import apiClient from 'services/axios'
/* eslint-disable */

export async function fetchAllSubscriptions({ qryString }) {
  return apiClient
    .get(`subscriptions?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
export async function fetchSubscriptionDetails({ subscriptionId }) {
  return apiClient
    .get(`subscriptions/${subscriptionId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateSubscription(data, body) {
  return apiClient
    .put(`subscriptions/${data.subscriptionId}/upgrade`, body)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function cancelSubscription(subscriptionId) {
  return apiClient
    .put(`subscriptions/${subscriptionId}/cancel`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchSubscriptionPayments({ qryString }) {
  return apiClient
    .get(`subscription-payments?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
