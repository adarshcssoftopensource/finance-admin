/* eslint-disable */
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import * as Services from 'services/business'
import actions from './actions'

export function* FETCH_ALL_BUSINESS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.fetchAllBusiness, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
        data: response.data,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* FETCH_ALL_ONBOARDING_REVIEW_BUSINESS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.fetchAllOnboardingReviewBusiness, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
        data: response.data,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* FETCH_BUSINESS_DETAIL({ payload: businessId }) {
  yield put({
    type: actions.SET_STATE_DETAIL,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.fetchBusinessDetails, businessId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
        data: response.data,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* ACTIVE_DEACTIVE_BUSINESS({ payload }) {
  const { isActive, businessId, queryString } = payload

  const filteredData = {
    payload: {
      qryString: queryString,
    },
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.activeDeactivaeBusiness, businessId, isActive)
  if (!response.error) {
    yield call(FETCH_ALL_BUSINESS, filteredData)
    showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* UPDATE_BUSINESS({ payload }) {
  const { businessId, data } = payload
  yield put({
    type: actions.SET_STATE_DETAIL,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.updateBusiness, businessId, data)
  if (!response.error) {
    const businessDetails = yield call(Services.fetchBusinessDetails, { businessId })
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
        data: businessDetails.data,
      },
    })
    showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* ADD_BUSINESS_NOTES({ payload }) {
  const { notes, businessId } = payload
  yield put({
    type: actions.SET_STATE_USERS,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.addBusinessNotes, businessId, notes)
  if (!response.error) {
    yield put({
      type: actions.LIST_BUSINESS_NOTES,
      payload: {
        ...response.data,
        apiCall: true,
      },
    })
    showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE_USERS,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* FORCE_UPDATE_PASSWORD({ payload }) {
  const { businessId } = payload
  yield put({
    type: actions.SET_STATE_USERS,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.forceUpdatePassword, businessId)
  if (!response.error) {
    // TODO:
    //   yield call(FETCH_BUSINESS_USERS, { payload: { businessId } })
    showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE_USERS,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* DELETE_STRIPE_ACCOUNT({ payload }) {
  const { businessId, qryString } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.deleteStripeAccount, businessId)
  if (response.error === false) {
    yield call(FETCH_ALL_BUSINESS, { payload: { qryString } })
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showSuccess(response.message)
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message, 'Oops')
  }
}

export function* CHANGE_STATEMENT_DESCRIPTOR({ payload }) {
  const { businessId, displayName } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      allUsers: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.changeStatementDescriptor, businessId, displayName)

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

export function* SYNC_BUSINESS_STRIPE_DATA({ payload }) {
  const { businessId, isUser = false, userId } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.syncStripeAccount, businessId)
  if (response.error === false) {
    yield call(FETCH_ALL_BUSINESS, {
      payload: { qryString: `pageNo=1&pageSize=100${isUser ? `&userId=${userId}` : ''}` },
    })
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showSuccess(response.message)
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message, 'Oops')
  }
}

export function* CLONE_BUSINESS({ payload }) {
  const { businessId, cloneBusinessId, legalName, statementDescriptor } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      cloneLoading: true,
    },
  })
  const response = yield call(
    Services.cloneBusiness,
    businessId,
    cloneBusinessId,
    legalName,
    statementDescriptor,
  )
  if (response.error === false) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        cloneLoading: false,
        clonedResponse: response,
      },
    })
    showSuccess(response.message)
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        cloneLoading: false,
      },
    })
    showError(response.message, 'Oops')
  }
}

export function* RESTRICT_BUSINESS({ payload, setSubmitLoading }) {
  const { payoutStatus, debitCardCreationStatus, walletLoadStatus, selectedBusinesses } = payload
  const qryString = payload?.qryString
  let filteredData

  if (qryString) {
    filteredData = {
      payload: {
        qryString,
      },
    }
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.restrictBusiness, {
    payoutStatus,
    debitCardCreationStatus,
    walletLoadStatus,
    selectedBusinesses,
  })
  if (!response.error) {
    if (setSubmitLoading) setSubmitLoading(false)
    showSuccess(response.message)
    if (qryString) {
      yield call(FETCH_ALL_BUSINESS, filteredData)
    }
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* TOGGLE_ONBOARDING({ payload }) {
  const { businessId, reqBody } = payload
  const response = yield call(Services.toggleOnboarding, businessId, reqBody)
  if (!response.error) {
    showSuccess(response.message)
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    showError(response.message, 'Oops')
  }
}

export function* TOGGLE_CAPABILITIES({ payload }) {
  const { businessId, capabilityType, status } = payload
  const response = yield call(
    Services.manageBusinessCapabilities,
    businessId,
    capabilityType,
    status,
  )
  if (!response.error) {
    const businessDetails = yield call(Services.fetchBusinessDetails, { businessId })
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
        data: businessDetails.data,
      },
    })
    if (response.statusCode === 200) {
      showSuccess(response.message)
    } else {
      showError(response.message, 'Oops')
    }
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    showError(response.message, 'Oops')
  }
}

export function* FETCH_BUSINESS_CAPABILITIES({ payload }) {
  const { businessId } = payload
  const response = yield call(Services.fetchBusinessCapabilities, businessId)
  if (!response.error) {
    yield put({
      type: actions.SET_BUSINESS_CAPABILITIES,
      payload: {
        loading: false,
        capabilities: response.data,
      },
    })
    if (response.statusCode === 200) {
      showSuccess(response.message)
    } else {
      showError(response.message, 'Oops')
      yield put({
        type: actions.SET_BUSINESS_CAPABILITIES,
        payload: {
          loading: false,
        },
      })
    }
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    showError(response.message, 'Oops')
    yield put({
      type: actions.SET_BUSINESS_CAPABILITIES,
      payload: {
        loading: false,
      },
    })
  }
}

export function* ADD_BUSINESS_CREDITS({ businessId, data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })

  const response = yield call(Services.addBusinessCredits, businessId, data)

  if (!response?.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })

    const businessDetails = yield call(Services.fetchBusinessDetails, { businessId })

    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
        data: businessDetails.data,
      },
    })

    showSuccess(response?.result?.message)
  } else {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })

    showError(response?.message)
  }
}

export function* ADJUST_BUSINESS_REWARD_POINTS({ businessId, data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.adjustRewardPoints, businessId, data)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    const businessDetails = yield call(Services.fetchBusinessDetails, { businessId })
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
        data: businessDetails.data,
      },
    })
    showSuccess(response?.result?.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* MIGRATE_DATA_FROM_PEYMYNT({ businessId, data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.migrateDataFromPeymynt, data)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showSuccess(response?.message || response?.result?.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
  const businessDetails = yield call(Services.fetchBusinessDetails, { businessId })
  yield put({
    type: actions.SET_STATE_DETAIL,
    payload: {
      loading: false,
      data: businessDetails.data,
    },
  })
}

export function* MANAGE_BUSINESS_PROVIDER({ payload }) {
  const { businessId, isLinked, providerName } = payload
  const response = yield call(Services.manageBusinessProvider, businessId, isLinked, providerName)
  if (!response.error) {
    const businessDetails = yield call(Services.fetchBusinessDetails, { businessId })
    yield put({
      type: actions.SET_STATE_DETAIL,
      payload: {
        loading: false,
        data: businessDetails.data,
      },
    })
    if (response.statusCode === 200) {
      showSuccess(response.message)
      window.location.reload()
    } else {
      showError(response.message, 'Oops')
    }
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    showError(response.message, 'Oops')
  }
}

export function* FETCH_BUSINESS_PROVIDER_LOGS({ payload }) {
  const { query } = payload
  yield put({
    type: actions.SET_BUSINESS_WEBHOOK_LOADING,
    payload: true,
  })
  const response = yield call(Services.fetchWebhookLogs, query)
  if (response?.statusCode === 200) {
    showSuccess(response.message)
    yield put({
      type: actions.SET_BUSINESS_WEBHOOK_LOGS,
      payload: response.data,
    })
  } else {
    yield put({
      type: actions.SET_BUSINESS_WEBHOOK_LOADING,
      payload: false,
    })
    showError(response?.message, 'Oops')
  }
}

export function* FETCH_BUSINESS_PROVIDER_ERROR_LOGS({ payload }) {
  const { query } = payload
  yield put({
    type: actions.SET_BUSINESS_ERROR_LOADING,
    payload: true,
  })
  const response = yield call(Services.fetchErrorLogs, query)
  if (response?.statusCode === 200) {
    showSuccess(response.message)
    yield put({
      type: actions.SET_BUSINESS_ERROR_LOGS,
      payload: response.data,
    })
  } else {
    yield put({
      type: actions.SET_BUSINESS_ERROR_LOADING,
      payload: false,
    })
    showError(response?.message, 'Oops')
  }
}

export function* UPDATE_BUSINESS_PAYMENT_SETTINGS({ payload }) {
  const { businessId, data } = payload
  yield put({
    type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.updateBusinessPaymentSettings, businessId, data)
  if (!response.error) {
    yield put({
      type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
      payload: {
        loading: false,
        paymentSettings: response.data,
      },
    })
    if (response.statusCode === 200) {
      showSuccess(response.message)
    } else {
      showError(response.message, 'Oops')
      yield put({
        type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
        payload: {
          loading: false,
        },
      })
    }
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    showError(response.message, 'Oops')
    yield put({
      type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
      payload: {
        loading: false,
      },
    })
  }
}

export function* FETCH_BUSINESS_PAYMENT_SETTINGS({ payload }) {
  const { businessId } = payload
  yield put({
    type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.fetchBusinessPaymentSettings, businessId)
  if (!response.error) {
    yield put({
      type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
      payload: {
        loading: false,
        paymentSettings: response.data,
      },
    })
    if (response.statusCode === 200) {
      showSuccess(response.message)
    } else {
      showError(response.message, 'Oops')
      yield put({
        type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
        payload: {
          loading: false,
        },
      })
    }
  } else if (response.error || response.statusCode < 200 || response.statusCode > 299) {
    showError(response.message, 'Oops')
    yield put({
      type: actions.SET_BUSINESS_PAYMENT_SETTINGS,
      payload: {
        loading: false,
      },
    })
  }
}

export function* BUSINESS_PAYOUT_FREQUENCY({ payload, setSubmitLoading }) {
  const { businessId } = payload
  const qryString = payload?.qryString
  let filteredData

  if (qryString) {
    filteredData = {
      payload: {
        qryString,
      },
    }
  }

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.updateBusinessPayoutFrequency, businessId, { ...payload })
  if (!response.error) {
    if (setSubmitLoading) setSubmitLoading(false)
    showSuccess(response.message)
    if (qryString) {
      yield call(FETCH_ALL_BUSINESS, filteredData)
    }
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* ADD_USER_TO_BUSINESS({ payload }) {
  const { businessId, data, onSuccess } = payload
  yield put({
    type: actions.SET_STATE_USERS,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.addUserToBusiness, businessId, data)
  if (!response.error) {
    yield put({
      type: 'users/FETCH_ALL_USERS',
      payload: {
        qryString: `pageNo=1&pageSize=100&businessId=${businessId}`,
      },
    })
    showSuccess(response.message)
    if (onSuccess) onSuccess()
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE_USERS,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

export function* REMOVE_USER_FROM_BUSINESS({ payload }) {
  const { businessId, userBusinessId } = payload
  yield put({
    type: actions.SET_STATE_USERS,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.removeUserFromBusiness, businessId, userBusinessId)
  if (!response.error) {
    yield put({
      type: 'users/FETCH_ALL_USERS',
      payload: {
        qryString: `pageNo=1&pageSize=100&businessId=${businessId}`,
      },
    })
    showSuccess(response.message)
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE_USERS,
      payload: {
        loading: false,
      },
    })
    showError(response.message)
  }
}

function showError(msg, label) {
  notification.error({
    message: label || 'Try again',
    description: msg,
  })
}

function showSuccess(msg) {
  notification.success({
    message: 'Success',
    description: msg,
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_BUSINESS, FETCH_ALL_BUSINESS),
    takeEvery(actions.FETCH_BUSINESS_DETAIL, FETCH_BUSINESS_DETAIL),
    takeEvery(actions.ACTIVE_DEACTIVE_BUSINESS, ACTIVE_DEACTIVE_BUSINESS),
    takeEvery(actions.ADD_BUSINESS_NOTES, ADD_BUSINESS_NOTES),
    takeEvery(actions.FORCE_UPDATE_PASSWORD, FORCE_UPDATE_PASSWORD),
    takeEvery(actions.DELETE_STRIPE_ACCOUNT, DELETE_STRIPE_ACCOUNT),
    takeEvery(actions.CHANGE_STATEMENT_DESCRIPTOR, CHANGE_STATEMENT_DESCRIPTOR),
    takeEvery(actions.SYNC_BUSINESS_STRIPE_DATA, SYNC_BUSINESS_STRIPE_DATA),
    takeEvery(actions.CLONE_BUSINESS, CLONE_BUSINESS),
    takeEvery(actions.RESTRICT_BUSINESS, RESTRICT_BUSINESS),
    takeEvery(actions.TOGGLE_ONBOARDING, TOGGLE_ONBOARDING),
    takeEvery(actions.FETCH_ALL_ONBOARDING_REVIEW_BUSINESS, FETCH_ALL_ONBOARDING_REVIEW_BUSINESS),
    takeEvery(actions.TOGGLE_CAPABILITIES, TOGGLE_CAPABILITIES),
    takeEvery(actions.FETCH_BUSINESS_CAPABILITIES, FETCH_BUSINESS_CAPABILITIES),
    takeEvery(actions.ADJUST_BUSINESS_REWARD_POINTS, ADJUST_BUSINESS_REWARD_POINTS),
    takeEvery(actions.MANAGE_BUSINESS_PROVIDER, MANAGE_BUSINESS_PROVIDER),
    takeEvery(actions.MIGRATE_DATA_FROM_PEYMYNT, MIGRATE_DATA_FROM_PEYMYNT),
    takeEvery(actions.FETCH_BUSINESS_PROVIDER_LOGS, FETCH_BUSINESS_PROVIDER_LOGS),
    takeEvery(actions.FETCH_BUSINESS_PROVIDER_ERROR_LOGS, FETCH_BUSINESS_PROVIDER_ERROR_LOGS),
    takeEvery(actions.FETCH_BUSINESS_PAYMENT_SETTINGS, FETCH_BUSINESS_PAYMENT_SETTINGS),
    takeEvery(actions.UPDATE_BUSINESS_PAYMENT_SETTINGS, UPDATE_BUSINESS_PAYMENT_SETTINGS),
    takeEvery(actions.BUSINESS_PAYOUT_FREQUENCY, BUSINESS_PAYOUT_FREQUENCY),
    takeEvery(actions.ADD_BUSINESS_CREDITS, ADD_BUSINESS_CREDITS),
    takeEvery(actions.UPDATE_BUSINESS, UPDATE_BUSINESS),
    takeEvery(actions.ADD_USER_TO_BUSINESS, ADD_USER_TO_BUSINESS),
    takeEvery(actions.REMOVE_USER_FROM_BUSINESS, REMOVE_USER_FROM_BUSINESS),
  ])
}
