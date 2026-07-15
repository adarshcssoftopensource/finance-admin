import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/refunds'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_REFUNDS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      refunds: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllRefunds, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refunds: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refunds: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* CREATE_REFUND({ payload, onSuccess, onError }) {
  try {
    yield put({ type: actions.SET_STATE, payload: { refundCreate: { loading: true } } })

    const response = yield call(Services.createRefund, payload)

    const isSuccess = response && response.success === true
    const message = response?.message || 'Refund failed'

    if (isSuccess) {
      yield put({
        type: actions.SET_STATE,
        payload: { refundCreate: { loading: false, data: response.data } },
      })
      Notification.showSuccess(message)
      if (onSuccess) onSuccess(response)
    } else {
      yield put({ type: actions.SET_STATE, payload: { refundCreate: { loading: false } } })
      Notification.showError(message)
      if (onError) onError(response)
    }
  } catch (err) {
    yield put({ type: actions.SET_STATE, payload: { refundCreate: { loading: false } } })
    const errorMessage = err?.response?.data?.message || err?.message || 'Something went wrong'
    Notification.showError(errorMessage)
    if (onError) onError({ error: true, message: errorMessage })
  }
}

export function* FETCH_REFUND_DETAIL({ payload: refundId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      refund: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchRefundDetails, refundId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refund: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refund: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_REFUNDS, FETCH_ALL_REFUNDS),
    takeEvery(actions.FETCH_REFUND_DETAIL, FETCH_REFUND_DETAIL),
    takeEvery(actions.CREATE_REFUND, CREATE_REFUND),
  ])
}
