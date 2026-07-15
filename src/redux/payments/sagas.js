import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/payments'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_PAYMENTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payments: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllPayments, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payments: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payments: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_PAYMENTS_DETAILS({ payload: paymentId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payment: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchPaymentDetails, paymentId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payment: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payment: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* SEND_CUSTOMER_SMS({ payload: { paymentId, text } }) {
  yield put({ type: actions.SET_STATE, payload: { sendingSMS: true } })
  const response = yield call(Services.sendCustomerSMS, { paymentId, text })
  yield put({ type: actions.SET_STATE, payload: { sendingSMS: false } })

  if (!response.error) {
    Notification.showSuccess('SMS sent successfully')
  } else {
    Notification.showError(response.message || 'Failed to send SMS')
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_PAYMENTS, FETCH_ALL_PAYMENTS),
    takeEvery(actions.FETCH_PAYMENTS_DETAILS, FETCH_PAYMENTS_DETAILS),
    takeEvery(actions.SEND_CUSTOMER_SMS, SEND_CUSTOMER_SMS),
  ])
}
