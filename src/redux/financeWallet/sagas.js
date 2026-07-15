import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/financeWallet'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_WALLET_STATS() {
  yield put({
    type: actions.SET_STATE,
    payload: { stats: { loading: true, data: null } },
  })
  const response = yield call(Services.fetchFinanceWalletStats)
  if (response && !response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: { stats: { loading: false, data: response } },
    })
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: { stats: { loading: false, data: null } },
    })
    if (response?.message) Notification.showError(response.message)
  }
}

export function* FETCH_WALLET_SIGNUPS({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: { signups: { loading: true, data: null } },
  })
  const response = yield call(Services.fetchFinanceWalletSignups, payload || {})
  if (response && !response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: { signups: { loading: false, data: response, error: null } },
    })
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: {
        signups: {
          loading: false,
          data: null,
          error: response?.message || 'Failed to load wallet signups',
        },
      },
    })
    if (response?.message) Notification.showError(response.message)
  }
}

export function* FETCH_ALL_WALLETS({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: { allWallets: { loading: true, data: null } },
  })
  const response = yield call(Services.fetchAllFinanceWallets, payload || {})
  if (response && !response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: { allWallets: { loading: false, data: response } },
    })
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: { allWallets: { loading: false, data: null } },
    })
    if (response?.message) Notification.showError(response.message)
  }
}

export function* FETCH_ALL_TRANSACTIONS({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: { allTransactions: { loading: true, data: null } },
  })
  const response = yield call(Services.fetchAllWalletTransactionsAdmin, payload || {})
  if (response && !response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: { allTransactions: { loading: false, data: response } },
    })
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: { allTransactions: { loading: false, data: null } },
    })
    if (response?.message) Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_WALLET_STATS, FETCH_WALLET_STATS),
    takeEvery(actions.FETCH_WALLET_SIGNUPS, FETCH_WALLET_SIGNUPS),
    takeEvery(actions.FETCH_ALL_WALLETS, FETCH_ALL_WALLETS),
    takeEvery(actions.FETCH_ALL_TRANSACTIONS, FETCH_ALL_TRANSACTIONS),
  ])
}
