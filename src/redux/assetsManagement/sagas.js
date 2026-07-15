import { all, takeEvery, call, put } from 'redux-saga/effects'
import { getAllAssets, removeAssets, uploadAssets } from 'services/assetsManagement'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_ASSETS({ payload }) {
  const { queryString } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      allAssets: {
        loading: true,
      },
    },
  })
  const response = yield call(getAllAssets, queryString)

  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allAssets: {
          loading: false,
          data: response.data?.data,
          nextPage: response.data?.nextPageToken,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allAssets: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* UPLOAD_ASSET({ payload }) {
  const { file, queryString } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      allAssets: {
        loading: true,
      },
    },
  })
  const response = yield call(uploadAssets, file)

  if (!response.error) {
    const response2 = yield call(getAllAssets, queryString)

    if (!response2.error) {
      Notification.showSuccess('Asset uploaded successfully')
      yield put({
        type: actions.SET_STATE,
        payload: {
          allAssets: {
            loading: false,
            data: response2.data?.data,
          },
        },
      })
    } else if (response2.error) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          allAssets: {
            loading: false,
          },
        },
      })
      Notification.showError(response.message)
    }
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allAssets: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* REMOVE_ASSET({ payload }) {
  const { key, queryString } = payload
  const response = yield call(removeAssets, { key })
  yield put({
    type: actions.SET_STATE,
    payload: {
      allAssets: {
        loading: true,
      },
    },
  })

  if (!response.error) {
    const response2 = yield call(getAllAssets, queryString)
    Notification.showSuccess('Asset removed successfully')
    if (!response2.error) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          allAssets: {
            loading: false,
            data: response2.data?.data,
          },
        },
      })
    } else if (response2.error) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          allAssets: {
            loading: false,
          },
        },
      })
      Notification.showError(response.message)
    }
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allAssets: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_ASSETS, FETCH_ALL_ASSETS),
    takeEvery(actions.UPLOAD_ASSETS, UPLOAD_ASSET),
    takeEvery(actions.REMOVE_ASSETS, REMOVE_ASSET),
  ])
}
