import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/walletLedgear'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_WALLET_LEDGER({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      walletSummary: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllWalletLedger, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        walletLedger: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        walletLedger: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_LEDGER_SUMMARY() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      walletSummary: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchLedgerSummary)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        walletSummary: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        walletSummary: {
          loading: false,
        },
      },
    })
    // Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_WALLET_LEDGER, FETCH_WALLET_LEDGER),
    takeEvery(actions.FETCH_LEDGER_SUMMARY, FETCH_LEDGER_SUMMARY),
  ])
}
