import { all, call, put, takeEvery } from 'redux-saga/effects'
import * as Services from 'services/systemSettings'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_SYSTEM_SETTINGS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      isLoading: true,
    },
  })
  const response = yield call(Services.getAllSettings, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        systemSettings: {
          ...response.data,
        },
        isLoading: false,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        isLoading: false,
      },
    })
    Notification.showError(response.message)
  }
}

export function* UPDATE_ALL_SYSTEM_SETTINGS({ payload: data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      isLoading: true,
    },
  })

  const response = yield call(Services.updateAllSettings, data)
  const systemSettings = yield call(Services.getAllSettings)
  if (!systemSettings.error) {
    Notification.showSuccess('Settings successfully updated')
    yield put({
      type: actions.SET_STATE,
      payload: {
        systemSettings: {
          ...systemSettings.data,
        },
        isLoading: false,
      },
    })
  }
  if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        isLoading: false,
      },
    })
    Notification.showError(response.message)
  }
}

export function* DELETE_SYSTEM_SETTINGS({ payload: deleteURL }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      isLoading: true,
    },
  })
  const response = yield call(Services.deleteSettings, deleteURL)
  const systemSettings = yield call(Services.getAllSettings)
  if (!systemSettings.error) {
    Notification.showSuccess('Setting successfully removed')
    yield put({
      type: actions.SET_STATE,
      payload: {
        systemSettings: {
          ...systemSettings.data,
        },
        isLoading: false,
      },
    })
  }
  if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        isLoading: false,
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_SYSTEM_SETTINGS, FETCH_ALL_SYSTEM_SETTINGS),
    takeEvery(actions.UPDATE_ALL_SYSTEM_SETTINGS, UPDATE_ALL_SYSTEM_SETTINGS),
    takeEvery(actions.DELETE_SYSTEM_SETTINGS, DELETE_SYSTEM_SETTINGS),
  ])
}
