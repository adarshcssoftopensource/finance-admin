import { all, call, put, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import * as Services from 'services/business'
import actions from './actions'

export function* FETCH_ALL_WEBHOOK_LOGS({ payload }) {
  const { query } = payload
  yield put({ type: actions.SET_WEBHOOK_LOADING, payload: true })

  const response = yield call(Services.fetchWebhookLogs, query)
  const logs = Array.isArray(response?.logs) ? response.logs : []

  if (response?.success) {
    yield put({
      type: actions.SET_WEBHOOK_LOGS,
      payload: { data: logs, meta: { total: response.total || logs.length } },
    })
  } else {
    yield put({ type: actions.SET_WEBHOOK_LOADING, payload: false })
    showError(response?.message || 'Failed to fetch webhook logs', 'Oops')
  }
}

export function* FETCH_ALL_ERROR_LOGS({ payload }) {
  const { query } = payload
  yield put({ type: actions.SET_ERROR_LOADING, payload: true })

  const response = yield call(Services.fetchErrorLogs, query)
  const logs = Array.isArray(response?.logs) ? response.logs : []

  if (response?.success) {
    yield put({
      type: actions.SET_ERROR_LOGS,
      payload: { data: logs, meta: { total: response.total || logs.length } },
    })
  } else {
    yield put({ type: actions.SET_ERROR_LOADING, payload: false })
    showError(response?.message || 'Failed to fetch error logs', 'Oops')
  }
}

function showError(msg, label) {
  notification.error({
    message: label || 'Try again',
    description: msg,
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_WEBHOOK_LOGS, FETCH_ALL_WEBHOOK_LOGS),
    takeEvery(actions.FETCH_ALL_ERROR_LOGS, FETCH_ALL_ERROR_LOGS),
  ])
}
