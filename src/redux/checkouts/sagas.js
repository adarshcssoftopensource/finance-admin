import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/checkouts'
import * as TimelineServices from 'services/timeline'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_CHECKOUTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      checkouts: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllCheckouts, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        checkouts: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        checkouts: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_CHECKOUT_TIMELINE({ payload: queryData }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      checkoutTimeline: {
        loading: true,
      },
    },
  })
  const response = yield call(
    TimelineServices.getTimeLine,
    queryData.checkoutId,
    queryData.businessId,
    queryData.userId,
  )
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        checkoutTimeline: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        checkoutTimeline: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_CHECKOUT_DETAILS({ payload: queryData }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      checkout: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchCheckoutDetails, queryData)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        checkout: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        checkout: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_CHECKOUTS, FETCH_ALL_CHECKOUTS)])
  yield all([takeEvery(actions.FETCH_CHECKOUT_TIMELINE, FETCH_CHECKOUT_TIMELINE)])
  yield all([takeEvery(actions.FETCH_CHECKOUT_DETAILS, FETCH_CHECKOUT_DETAILS)])
}
