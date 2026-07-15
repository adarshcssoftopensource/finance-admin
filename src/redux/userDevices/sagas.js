import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/userDevices'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_USER_DEVICES({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      userDevices: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchUserDevices, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userDevices: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userDevices: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_USER_DEVICES, FETCH_USER_DEVICES)])
}
