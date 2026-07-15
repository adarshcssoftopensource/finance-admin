import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/banner'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_BANNERS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      allBanner: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllBanner, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allBanner: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allBanner: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_ALL_BANNER_TARGETS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      allBannerTargets: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllBannerTargets, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allBannerTargets: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allBannerTargets: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_BANNER, FETCH_ALL_BANNERS),
    takeEvery(actions.FETCH_ALL_BANNER_TARGET, FETCH_ALL_BANNER_TARGETS),
  ])
}
