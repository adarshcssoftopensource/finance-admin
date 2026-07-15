import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/subscriptions'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_SUBSCRIPTIONS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      subscriptions: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllSubscriptions, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        subscriptions: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        subscriptions: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_SUBSCRIPTION_DETAILS({ payload: subscriptionId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      subscription: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchSubscriptionDetails, subscriptionId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        subscription: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        subscription: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_SUBSCRIPTION_PAYMENTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payments: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchSubscriptionPayments, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payments: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payments: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* UPDATE_SUBSCRIPTION({ data, payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.updateSubscription, data, payload)
  if (!response.error) {
    data.getSubscription()
    Notification.showSuccess(response.message)
    yield put({
      type: actions.SET_STATE,
      payload: {
        subscription: {
          loading: true,
        },
      },
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        subscription: {
          loading: false,
          data: response.data,
        },
      },
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
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

export function* CANCEL_SUBSCRIPTION({ payload, data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.cancelSubscription, payload.subscriptionId)
  if (!response.error) {
    if (data && data.getSubscription) {
      data.getSubscription()
    }
    Notification.showSuccess(response.message)
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
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
  yield all([
    takeEvery(actions.FETCH_ALL_SUBSCRIPTIONS, FETCH_ALL_SUBSCRIPTIONS),
    takeEvery(actions.FETCH_SUBSCRIPTION_DETAILS, FETCH_SUBSCRIPTION_DETAILS),
    takeEvery(actions.FETCH_SUBSCRIPTION_PAYMENTS, FETCH_SUBSCRIPTION_PAYMENTS),
    takeEvery(actions.UPDATE_SUBSCRIPTION, UPDATE_SUBSCRIPTION),
    takeEvery(actions.CANCEL_SUBSCRIPTION, CANCEL_SUBSCRIPTION),
  ])
}
