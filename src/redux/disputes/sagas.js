import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/dispute'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_DISPUTES({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      disputes: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllDisputes, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        disputes: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        disputes: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_DISPUTE({ disputeId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      dispute: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchDispute, disputeId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        dispute: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        dispute: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* MANAGE_DISPUTE({ data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      dispute: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.manageDispute, data?.disputeId, data)
  if (!response.error) {
    Notification.showSuccess(response.message)
    const fetchDisputeDetailResponse = yield call(Services.fetchDispute, data?.internalDisputeId)
    if (!fetchDisputeDetailResponse.error) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          dispute: {
            loading: false,
            data: fetchDisputeDetailResponse.data,
          },
        },
      })
    }
  } else if (response.error) {
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_DISPUTES, FETCH_ALL_DISPUTES)])
  yield all([takeEvery(actions.FETCH_DISPUTE, FETCH_DISPUTE)])
  yield all([takeEvery(actions.MANAGE_DISPUTE, MANAGE_DISPUTE)])
}
