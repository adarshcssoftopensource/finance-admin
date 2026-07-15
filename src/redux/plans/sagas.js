import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/plans'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_PLANS() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.fetchAllPlans)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
        data: response.data,
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

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_PLANS, FETCH_ALL_PLANS)])
}
