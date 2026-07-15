import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/pushNotifications'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_PUSH_NOTIFICATIONS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      pushNotifications: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchPushNotifications, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        pushNotifications: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        pushNotifications: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* SEND_PUSH_NOTIFICATION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      pushNotifications: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.sendPushNotification, payload)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        pushNotifications: {
          loading: false,
        },
      },
    })
    Notification.showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        pushNotifications: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_SINGLE_PUSH_NOTIFICATION({ payload: { id } }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      singleNotification: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchSinglePushNotification, id)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        singleNotification: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        singleNotification: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_PUSH_NOTIFICATIONS, FETCH_PUSH_NOTIFICATIONS)])
  yield all([takeEvery(actions.FETCH_SINGLE_PUSH_NOTIFICATION, FETCH_SINGLE_PUSH_NOTIFICATION)])
  yield all([takeEvery(actions.SEND_PUSH_NOTIFICATION, SEND_PUSH_NOTIFICATION)])
}
