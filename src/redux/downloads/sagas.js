import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/downloads'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_DOWNLOADS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.fetchAllDownloads, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        downloads: response.data,
        loading: false,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    Notification.showError(response.message)
  }
}

export function* DELETE_SINGLE_DOWNLOAD({ payload: { id, qryString } }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.deleteSingleDownload, { id })
  if (!response.error) {
    yield call(FETCH_ALL_DOWNLOADS, { payload: { qryString } })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_DOWNLOADS, FETCH_ALL_DOWNLOADS)])
  yield all([takeEvery(actions.DELETE_SINGLE_DOWNLOAD, DELETE_SINGLE_DOWNLOAD)])
}
