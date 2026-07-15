import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/customer'
import * as Notification from 'services/showNotifications'
import actions from './actions'

function* BLOCK_CUSTOMER({ payload, onSuccess, onError }) {
  try {
    yield put({ type: actions.SET_STATE, payload: { blockStatus: { loading: true } } })
    const response = yield call(Services.blockCustomerGlobally, payload.customerId)

    if (response && response.statusCode === 200) {
      yield put({
        type: actions.SET_STATE,
        payload: { blockStatus: { loading: false, data: response.data } },
      })
      Notification.showSuccess(response.message)
      if (onSuccess) onSuccess(response)
    } else {
      yield put({ type: actions.SET_STATE, payload: { blockStatus: { loading: false } } })
      Notification.showError(response.message || 'Failed to block customer')
      if (onError) onError(response)
    }
  } catch (err) {
    yield put({ type: actions.SET_STATE, payload: { blockStatus: { loading: false } } })
    const errorMessage = err?.message || 'Something went wrong'
    Notification.showError(errorMessage)
    if (onError) onError({ error: true, message: errorMessage })
  }
}

function* UNBLOCK_CUSTOMER({ payload, onSuccess, onError }) {
  try {
    yield put({ type: actions.SET_STATE, payload: { blockStatus: { loading: true } } })

    const response = yield call(Services.unblockCustomerGlobally, payload.customerId)

    if (response && response.statusCode === 200) {
      yield put({
        type: actions.SET_STATE,
        payload: { blockStatus: { loading: false, data: response.data } },
      })
      Notification.showSuccess(response.message)
      if (onSuccess) onSuccess(response)
    } else {
      yield put({ type: actions.SET_STATE, payload: { blockStatus: { loading: false } } })
      Notification.showError(response.message || 'Failed to unblock customer')
      if (onError) onError(response)
    }
  } catch (err) {
    yield put({ type: actions.SET_STATE, payload: { blockStatus: { loading: false } } })
    const errorMessage = err?.response?.data?.message || err?.message || 'Something went wrong'
    Notification.showError(errorMessage)
    if (onError) onError({ error: true, message: errorMessage })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.BLOCK_CUSTOMER, BLOCK_CUSTOMER),
    takeEvery(actions.UNBLOCK_CUSTOMER, UNBLOCK_CUSTOMER),
  ])
}
