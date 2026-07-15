import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/peyme'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_PEYME({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      peyme: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllPeyme, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        peyme: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        peyme: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* VERIFIED_UNVERIFIED_BUSINESS({ payload }) {
  const { isVerified, id, queryString } = payload

  const filteredData = {
    payload: {
      qryString: queryString,
    },
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.verifiedUnverifiedBusiness, id, isVerified)
  if (!response.error) {
    yield call(FETCH_ALL_PEYME, filteredData)
    Notification.showSuccess(response.message)
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
  yield all([
    takeEvery(actions.FETCH_ALL_PEYME, FETCH_ALL_PEYME),
    takeEvery(actions.VERIFIED_UNVERIFIED_BUSINESS, VERIFIED_UNVERIFIED_BUSINESS),
  ])
}
