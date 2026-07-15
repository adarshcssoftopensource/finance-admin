import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/documents'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_DOCUMENTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      documents: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchDocuments, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        documents: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        documents: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_DOCUMENTS, FETCH_DOCUMENTS)])
}
