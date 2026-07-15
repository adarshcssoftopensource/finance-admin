import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
// import { history } from 'redux/dashboard/node_modules/index'
import * as Services from 'services/dashboard'
import actions from './actions'

export function* FETCH_USER() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      userLoading: true,
    },
  })
  const response = yield call(Services.fetchUserStats)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userLoading: false,
        userStats: response.data.usersStats,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userLoading: false,
      },
    })
    showError(response.message)
  }
}

export function* FETCH_BIZ() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      bizLoading: true,
    },
  })
  const response = yield call(Services.fetchBusinessStats)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        bizLoading: false,
        bizStats: response.data.businessesStats,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        bizLoading: false,
      },
    })
    showError(response.message)
  }
}

export function* WALLET_STATS() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      WalletLoading: true,
    },
  })
  const response = yield call(Services.WalletStatistics)

  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        WalletLoading: false,
        WalletStats: response.data,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        WalletLoading: false,
      },
    })
    showError(response.message)
  }
}

function showError(msg) {
  notification.error({
    message: 'Try again',
    description: msg,
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_USER_STATS, FETCH_USER),
    takeEvery(actions.GET_BUSINESS_STATS, FETCH_BIZ),
    takeEvery(actions.GET_WALLET_STATISTICS, WALLET_STATS),
  ])
}
