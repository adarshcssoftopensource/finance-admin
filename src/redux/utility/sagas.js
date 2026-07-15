import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/utility'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_CURRENCY() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      currency: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchCurrency)
  const payloadData =
    response && response.data && response.data.data !== undefined
      ? response.data.data
      : response && response.data

  if (response && !response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        currency: {
          loading: false,
          data: payloadData,
        },
      },
    })
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: {
        currency: {
          loading: false,
        },
      },
    })
    Notification.showError((response && response.message) || 'Failed to fetch currencies')
  }
}

export function* FETCH_ALL_COUNTRY() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      country: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchCountry)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        country: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        country: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_CURRENCY, FETCH_ALL_CURRENCY),
    takeEvery(actions.FETCH_ALL_COUNTRY, FETCH_ALL_COUNTRY),
  ])
}
