import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/requests/index'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_REQUESTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      allRequests: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllRequests, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allRequests: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allRequests: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_SINGLE_REQUEST({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      request: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchSingleRequest, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        request: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        request: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* UPDATE_MESSAGE_REQUEST({ payload }) {
  const { requestId, requestData, keywords } = payload

  yield put({
    type: actions.SET_STATE,
    payload: { loading: true },
  })

  const response = yield call(Services.updateRequestMessage, requestId, requestData.message)

  if (!response.error && response.statusCode === 200) {
    Notification.showSuccess(response.message)

    yield put({
      type: actions.SET_STATE,
      payload: { allRequests: { loading: true } },
    })

    const allRequestsResponse = yield call(Services.fetchAllRequests, {
      qryString: `pageNo=1&pageSize=100&status=pending${keywords ? `&keywords=${keywords}` : ''}`,
    })

    yield put({
      type: actions.SET_STATE,
      payload: {
        allRequests: { loading: false, data: allRequestsResponse.data },
      },
    })
  } else {
    Notification.showError(response.message || 'Failed to update message')
  }

  yield put({ type: actions.SET_STATE, payload: { loading: false } })
}

export function* UPDATE_SINGLE_REQUEST({ payload }) {
  const { requestData, requestId, keywords } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.changeRequestStatus, requestId, requestData)
  if (!response.error && response.statusCode === 200) {
    Notification.showSuccess(response.message)
    yield put({
      type: actions.SET_STATE,
      payload: {
        allRequests: {
          loading: true,
        },
      },
    })
    const allRequestsResponse = yield call(Services.fetchAllRequests, {
      qryString: `pageNo=1&pageSize=100&status=pending${keywords ? `&keywords=${keywords}` : ''}`,
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        allRequests: {
          loading: false,
          data: allRequestsResponse.data,
        },
      },
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    Notification.showError(response.message)
  }
}

export function* UPDATE_BULK_REQUEST({ payload }) {
  const { requestData, keywords } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.bulkChangeRequestStatus, requestData)
  if (!response.error && response.statusCode === 200) {
    Notification.showSuccess(response.message)
  } else {
    Notification.showError(response.message)
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      allRequests: {
        loading: true,
      },
    },
  })
  const allRequestsResponse = yield call(Services.fetchAllRequests, {
    qryString: `pageNo=1&pageSize=100&status=pending${keywords ? `&keywords=${keywords}` : ''}`,
  })
  yield put({
    type: actions.SET_STATE,
    payload: {
      allRequests: {
        loading: false,
        data: allRequestsResponse.data,
      },
    },
  })
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_REQUESTS, FETCH_ALL_REQUESTS)])
  yield all([takeEvery(actions.FETCH_SINGLE_REQUEST, FETCH_SINGLE_REQUEST)])
  yield all([takeEvery(actions.UPDATE_SINGLE_REQUEST, UPDATE_SINGLE_REQUEST)])
  yield all([takeEvery(actions.UPDATE_BULK_REQUEST, UPDATE_BULK_REQUEST)])
  yield all([takeEvery(actions.UPDATE_MESSAGE_REQUEST, UPDATE_MESSAGE_REQUEST)])
}
