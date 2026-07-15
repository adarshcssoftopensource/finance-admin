import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/debitCards'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_DEBIT_CARDS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      debitCards: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllDebitCards, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        debitCards: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        debitCards: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_ALL_DEBIT_CARDS_DETAILS({ payload: walletId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      debitCard: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllDebitCardDetails, walletId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        debitCard: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        debitCard: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_ALL_WALLET_TRANSACTION({ payload: { qryString } }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      walletTransactions: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllWalletTransactions, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        walletTransactions: {
          loading: false,
          data: response.data,
        },
        loading: false,
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        walletTransactions: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* CHANGE_DEBIT_CARD_STATUS({ payload }) {
  const { status, debitCardId, walletId } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.changeDebitCardStatus, debitCardId, status)
  if (!response.error) {
    const detailResponse = yield call(Services.fetchAllDebitCardDetails, { walletId })
    yield put({
      type: actions.SET_STATE,
      payload: {
        debitCard: {
          loading: false,
          data: detailResponse.data,
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

export function* CHANGE_DEBIT_CARD_WALLET_STATUS({ payload }) {
  const { walletId, status } = payload
  const filterData = {
    payload: {
      walletId,
    },
  }
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      debitCards: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.changeDebitCardWalletStatus, walletId, status)
  if (!response.error) {
    yield call(FETCH_ALL_DEBIT_CARDS_DETAILS, filterData)
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

export function* REPLACE_DEBIT_CARD({ payload }) {
  const { debitCardId, businessId, walletId, status } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  const response = yield call(Services.replaceOrCancelDebitCard, debitCardId, businessId, status)
  if (!response.error) {
    const detailResponse = yield call(Services.fetchAllDebitCardDetails, { walletId })
    yield put({
      type: actions.SET_STATE,
      payload: {
        debitCard: {
          loading: false,
          data: detailResponse.data,
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

export function* DELETE_DEBIT_CARD_WALLET({ payload }) {
  const { walletId, remarks, qryString } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      debitCards: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.deleteDebitCardWallet, walletId, remarks)
  if (!response.error) {
    Notification.showSuccess(response.message)
    yield call(FETCH_ALL_DEBIT_CARDS, { payload: { qryString } })
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

export function* CHANGE_BULK_DEBIT_CARD_STATUS({ payload }) {
  const { qryString, requestData } = payload

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      debitCards: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.changeBulkDebitCardStatus, requestData)
  if (!response.error) {
    Notification.showSuccess(response.message)
    yield call(FETCH_ALL_DEBIT_CARDS, { payload: { qryString } })
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
        debitCards: {
          loading: false,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
        debitCards: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_DEBIT_CARDS, FETCH_ALL_DEBIT_CARDS),
    takeEvery(actions.FETCH_ALL_DEBIT_CARDS_DETAILS, FETCH_ALL_DEBIT_CARDS_DETAILS),
    takeEvery(actions.FETCH_ALL_WALLET_TRANSACTION, FETCH_ALL_WALLET_TRANSACTION),
    takeEvery(actions.CHANGE_DEBIT_CARD_STATUS, CHANGE_DEBIT_CARD_STATUS),
    takeEvery(actions.CHANGE_DEBIT_CARD_WALLET_STATUS, CHANGE_DEBIT_CARD_WALLET_STATUS),
    takeEvery(actions.REPLACE_DEBIT_CARD, REPLACE_DEBIT_CARD),
    takeEvery(actions.DELETE_DEBIT_CARD_WALLET, DELETE_DEBIT_CARD_WALLET),
    takeEvery(actions.CHANGE_BULK_DEBIT_CARD_STATUS, CHANGE_BULK_DEBIT_CARD_STATUS),
  ])
}
