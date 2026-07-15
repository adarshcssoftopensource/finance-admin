import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/scheduler'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_SCHEDULERS({ payload: qryString }) {
  try {
    yield put({
      type: actions.START_SCHEDULER_LOADING,
    })
    const response = yield call(Services.fetchAllScheduler, qryString)
    if (!response.error) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          schedulers: response?.data?.schedulers || [],
        },
      })
    } else if (response.error) {
      yield put({
        type: actions.STOP_SCHEDULER_LOADING,
      })
      Notification.showError(response.message)
    }
  } catch (e) {
    yield put({
      type: actions.STOP_SCHEDULER_LOADING,
    })
    Notification.showError(e.message)
  }
}

export function* ADD_SCHEDULER({ payload }) {
  try {
    const { data } = payload
    yield put({
      type: actions.START_SCHEDULER_LOADING,
    })

    const response = yield call(Services.addScheduler, data)
    if (!response.error) {
      yield put({
        type: actions.FETCH_ALL_SCHEDULERS,
        payload: '',
      })
    } else if (response.error) {
      yield put({
        type: actions.STOP_SCHEDULER_LOADING,
      })
      Notification.showError(response.message)
    }
  } catch (err) {
    yield put({
      type: actions.STOP_SCHEDULER_LOADING,
    })
    Notification.showError(err.message)
  }
}

export function* EDIT_SCHEDULER({ payload }) {
  try {
    yield put({
      type: actions.START_SCHEDULER_LOADING,
    })

    const response = yield call(Services.editScheduler, payload)
    if (!response.error) {
      yield put({
        type: actions.FETCH_ALL_SCHEDULERS,
        payload: '',
      })
    } else if (response.error) {
      yield put({
        type: actions.STOP_SCHEDULER_LOADING,
      })
      Notification.showError(response.message)
    }
  } catch (err) {
    yield put({
      type: actions.STOP_SCHEDULER_LOADING,
    })
    Notification.showError(err.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_SCHEDULERS, FETCH_ALL_SCHEDULERS)])
  yield all([takeEvery(actions.ADD_SCHEDULER, ADD_SCHEDULER)])
  yield all([takeEvery(actions.EDIT_SCHEDULER, EDIT_SCHEDULER)])
}
