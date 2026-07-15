import store from 'store'

const validJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjogeyJ1c2VyIjogeyJfaWQiOiAic3RhdGljLXVzZXItMTIzIiwgInByaW1hcnlFbWFpbCI6ICJ1c2VyQGZpbmFuY2UuY29tIn19fQ.ZHVtbXk'

// eslint-disable-next-line no-unused-vars
export async function login(email) {
  store.set('accessToken', validJWT)
  return {
    data: { accessToken: validJWT, user: { name: 'Static Admin', email } },
    message: 'Success',
  }
}

// eslint-disable-next-line no-unused-vars
export async function register(email, password, name) {
  store.set('accessToken', validJWT)
  return {
    data: { accessToken: validJWT, user: { name: name || 'Static Admin', email } },
    message: 'Success',
  }
}

export async function currentAccount() {
  store.set('accessToken', validJWT)
  return {
    data: { accessToken: validJWT, user: { name: 'Static Admin', email: 'admin@finance.com' } },
    message: 'Success',
  }
}

export async function logout() {
  return store.clearAll()
}
