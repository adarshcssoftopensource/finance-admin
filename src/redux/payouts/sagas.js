import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/payouts'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_PAYOUTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payouts: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllPayouts, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payouts: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payouts: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_PAYOUT_DETAIL({ payload: payoutId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payout: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchPayoutDetails, payoutId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payout: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payout: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_PAYOUTS, FETCH_ALL_PAYOUTS),
    takeEvery(actions.FETCH_PAYOUT_DETAIL, FETCH_PAYOUT_DETAIL),
  ])
}
