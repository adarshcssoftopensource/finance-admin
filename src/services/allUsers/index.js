import apiClient from 'services/axios'

export async function fetchAllUsers({ qryString }) {
  return apiClient
    .get(`users?${qryString || ''}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchUserDetails({ userId }) {
  return apiClient
    .get(`users/${userId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function activeDeactiveUser(userId, isActive) {
  return apiClient
    .patch(`users/${userId}/block`, { isActive })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function userResetPassword(userId) {
  return apiClient
    .patch(`users/${userId}/reset`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addUsersNotes(userId, notes) {
  return apiClient
    .put(`users/${userId}/notes`, notes)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function userChangePassword(userId) {
  return apiClient
    .patch(`users/${userId}/change-password`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function assumeUser(userId) {
  return apiClient
    .get(`users/${userId}/assume`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function changeConnectedEmail(userId, emailData) {
  return apiClient
    .patch(`users/${userId}/connectedemail`, emailData)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function requestVerification(userId, body) {
  return apiClient
    .put(`users/${userId}/request-verification`, body)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function change2FAStatus(userId, payload) {
  return apiClient
    .patch(`users/${userId}/2fa`, payload)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function changeMobileNumber(userId, payload) {
  return apiClient
    .patch(`users/${userId}/mobile-number`, payload)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function updateUserDetails(userId, payload) {
  return apiClient
    .patch(`users/${userId}`, payload)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error('Error updating user details:', err)
      throw err
    })
}

export async function updateUserAddress(userId, payload) {
  return apiClient
    .patch(`users/${userId}/address`, payload)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error('Error updating user address:', err)
      throw err
    })
}

export async function fetchUserSession(userId, queryString) {
  return apiClient
    .get(`users/${userId}/session?${queryString}`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function signOutUserSession({ userId, sessionId, payload }) {
  return apiClient
    .patch(`users/${userId}/session/${sessionId}`, payload)
    .then(response => {
      return response
    })
    .catch(err => {
      console.log(err)
    })
}
