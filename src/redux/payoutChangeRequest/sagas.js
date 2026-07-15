import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/payoutChangeRequest'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_PAYOUT_CHANGE_REQUESTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payoutChangeRequests: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchPayoutChangeRequests, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payoutChangeRequests: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payoutChangeRequests: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_PAYOUT_CHANGE_REQUEST({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payoutChangeRequest: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchPayoutChangeRequest, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payoutChangeRequest: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payoutChangeRequest: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* UPDATE_PAYOUT_CHANGE_REQUEST({ payload }) {
  const { requestData, requestId, keywords } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.changePayoutRequestStatus, requestId, requestData)
  if (!response.error) {
    Notification.showSuccess(response.message)
    yield put({
      type: actions.SET_STATE,
      payload: {
        payoutChangeRequests: {
          loading: true,
        },
      },
    })
    const payoutChangeResponse = yield call(Services.fetchPayoutChangeRequests, {
      qryString: `pageNo=1&pageSize=100${keywords ? `&keywords=${keywords}` : ''}`,
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        payoutChangeRequests: {
          loading: false,
          data: payoutChangeResponse.data,
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

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_PAYOUT_CHANGE_REQUESTS, FETCH_PAYOUT_CHANGE_REQUESTS)])
  yield all([takeEvery(actions.FETCH_PAYOUT_CHANGE_REQUEST, FETCH_PAYOUT_CHANGE_REQUEST)])
  yield all([takeEvery(actions.UPDATE_PAYOUT_CHANGE_REQUEST, UPDATE_PAYOUT_CHANGE_REQUEST)])
}
