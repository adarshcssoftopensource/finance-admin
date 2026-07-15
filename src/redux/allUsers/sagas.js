import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/allUsers'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_USERS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllUsers, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allUsers: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allUsers: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* ACTIVE_DEACTIVE_USERS({ payload }) {
  const { userId, isActive, queryString } = payload
  const filteredData = {
    payload: {
      qryString: queryString,
    },
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.activeDeactiveUser, userId, isActive)
  if (!response.error) {
    yield call(FETCH_ALL_USERS, filteredData)
    Notification.showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        allUsers: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* RESET_PASSWORD_USERS({ payload }) {
  const { userId } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.userResetPassword, userId)
  if (!response.error) {
    Notification.showSuccess(response.message)
  } else if (response.error) {
    Notification.showError(response.message)
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: false,
      },
    },
  })
}

export function* ADD_USER_NOTES({ payload }) {
  const { notes, userId } = payload
  const response = yield call(Services.addUsersNotes, userId, notes)
  if (!response.error) {
    yield put({
      type: actions.LIST_USERS_NOTES,
      payload: {
        ...response.data,
      },
    })
    Notification.showSuccess(response.message)
  } else if (response.error) {
    Notification.showError(response.message)
  }
}

export function* FETCH_USER_USER({ payload }) {
  const userId = typeof payload === 'object' ? payload.userId : payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      user: {
        loading: true,
        data: [],
      },
    },
  })
  const response = yield call(Services.fetchUserDetails, { userId })
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        user: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        user: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* ASSUME_USER({ payload: userId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      userToken: {
        loading: true,
        token: {},
      },
    },
  })
  const newWindow = window.open()
  const response = yield call(Services.assumeUser, userId)
  if (!response.error) {
    newWindow.location = `${process.env.REACT_APP_WEB_URL}/signin/#${response.data.refreshToken}`
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        userToken: {
          loading: false,
          token: {},
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* CHANGE_CONNECTED_EMAIL({ payload }) {
  const { userId } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.changeConnectedEmail, userId, payload)

  if (!response.error) {
    Notification.showSuccess(response.message)
  } else if (response.error) {
    Notification.showError(response.message)
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: false,
      },
    },
  })
}

export function* REQUEST_VERIFICATION({ payload }) {
  const { userId, requestedStatus, qryString } = payload
  const response = yield call(Services.requestVerification, userId, { requestedStatus })
  if (!response.error) {
    Notification.showSuccess(response.message)
    yield call(FETCH_ALL_USERS, { payload: { qryString } })
  } else if (response.error) {
    Notification.showError(response.message)
  }
}

export function* CHANGE_2FA_STATUS({ payload }) {
  const { userId } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.change2FAStatus, userId, payload)

  if (!response.error) {
    yield put({
      type: actions.FETCH_USER_USER,
      payload: {
        userId,
      },
    })
    Notification.showSuccess(response.message)
  } else if (response.error) {
    Notification.showError(response.message)
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: false,
      },
    },
  })
}

export function* CHANGE_MOBILE_NUMBER({ payload }) {
  const { userId, mobileNumber } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.changeMobileNumber, userId, { mobileNumber })

  if (!response.error) {
    yield put({
      type: actions.FETCH_USER_USER,
      payload: {
        userId,
      },
    })
    Notification.showSuccess(response.message)
  } else if (response.error) {
    Notification.showError(response.message)
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: false,
      },
    },
  })
}

export function* UPDATE_USER_ADDRESS({ payload }) {
  const { userId, addressData } = payload

  yield put({
    type: actions.SET_STATE,
    payload: { user: { loading: true } },
  })

  try {
    const response = yield call(Services.updateUserAddress, userId, addressData)

    if (!response.error) {
      Notification.showSuccess(response.message || 'Address updated successfully')

      yield put({
        type: actions.FETCH_USER_USER,
        payload: { userId },
      })
    } else {
      Notification.showError(response.message || 'Failed to update address')
    }
  } catch (err) {
    console.error(err)
    Notification.showError(err.message || 'Something went wrong while updating address')
  }

  yield put({
    type: actions.SET_STATE,
    payload: { user: { loading: false } },
  })
}

export function* FETCH_USER_SESSION({ payload }) {
  const { userId, qryString } = payload
  yield put({
    type: actions.START_FETCH_USER_SESSION,
  })
  const response = yield call(Services.fetchUserSession, userId, qryString)

  if (!response.error) {
    yield put({
      type: actions.SET_USER_SESSION,
      payload: {
        loading: false,
        data: response.data?.data ?? {},
      },
    })
  } else if (response.error) {
    Notification.showError(response.message)
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      user: {
        loading: false,
      },
    },
  })
}

export function* SIGN_OUT_SESSION({ payload }) {
  const { userId, sessionId, sessionPayload, qryString } = payload
  yield put({
    type: actions.START_FETCH_USER_SESSION,
  })
  const response = yield call(Services.signOutUserSession, {
    userId,
    sessionId,
    payload: sessionPayload,
  })

  if (!response.error) {
    yield put({
      type: actions.FETCH_USER_SESSION,
      payload: {
        userId,
        qryString,
      },
    })
    Notification.showSuccess(response.message)
  } else if (response.error) {
    Notification.showError(response.message)
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      user: {
        loading: false,
      },
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_USERS, FETCH_ALL_USERS),
    takeEvery(actions.ACTIVE_DEACTIVE_USERS, ACTIVE_DEACTIVE_USERS),
    takeEvery(actions.RESET_PASSWORD_USERS, RESET_PASSWORD_USERS),
    takeEvery(actions.FETCH_USER_USER, FETCH_USER_USER),
    takeEvery(actions.ADD_USERS_NOTES, ADD_USER_NOTES),
    takeEvery(actions.ASSUME_USER, ASSUME_USER),
    takeEvery(actions.CHANGE_CONNECTED_EMAIL, CHANGE_CONNECTED_EMAIL),
    takeEvery(actions.REQUEST_VERIFICATION, REQUEST_VERIFICATION),
    takeEvery(actions.CHANGE_2FA_STATUS, CHANGE_2FA_STATUS),
    takeEvery(actions.CHANGE_MOBILE_NUMBER, CHANGE_MOBILE_NUMBER),
    takeEvery(actions.UPDATE_USER_ADDRESS, UPDATE_USER_ADDRESS),
    takeEvery(actions.FETCH_USER_SESSION, FETCH_USER_SESSION),
    takeEvery(actions.SIGN_OUT_SESSION, SIGN_OUT_SESSION),
  ])
}
