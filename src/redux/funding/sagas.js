import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/funding'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_FUNDING_LINKS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      fundingLinks: {
        loading: true,
      },
    },
  })

  const response = yield call(Services.fetchAllFundingLinks, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        fundingLinks: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        fundingLinks: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* VERIFIED_UNVERIFIED_FUNDING_BUSINESS({ payload }) {
  const { isVerified, id, queryString } = payload

  const filteredData = {
    payload: {
      qryString: queryString,
    },
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      fundingLinks: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.verifiedUnverifiedBusiness, id, isVerified)
  if (!response.error) {
    yield call(FETCH_ALL_FUNDING_LINKS, filteredData)
    Notification.showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        fundingLinks: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_FUNDING_LINKS, FETCH_ALL_FUNDING_LINKS),
    takeEvery(actions.VERIFIED_UNVERIFIED_FUNDING_BUSINESS, VERIFIED_UNVERIFIED_FUNDING_BUSINESS),
  ])
}
