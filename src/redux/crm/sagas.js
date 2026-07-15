import { all, call, put, takeEvery } from 'redux-saga/effects'
import * as Services from 'services/crm'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_DATA_BY_FILTER({ payload: { filter, queryString } }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      userData: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.applyFilter, filter, queryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userData: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userData: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_DATA_BY_FILTER, FETCH_DATA_BY_FILTER)])
}
