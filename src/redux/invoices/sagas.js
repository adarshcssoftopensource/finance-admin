import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/invoices'
import * as TimelineServices from 'services/timeline'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_BAD_INVOICES({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      badInvoices: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllBadInvoices, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        badInvoices: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        badInvoices: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_ALL_INVOICES({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      invoices: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllInvoices, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        invoices: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        invoices: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_INVOICE_TIMELINE({ payload: queryData }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      invoiceTimeline: {
        loading: true,
      },
    },
  })
  const response = yield call(
    TimelineServices.getTimeLine,
    queryData.invoiceId,
    queryData.businessId,
    queryData.userId,
  )
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        invoiceTimeline: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        invoiceTimeline: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_INVOICE_DETAILS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      invoice: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchInvoiceDetails, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        invoice: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        invoice: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_BAD_INVOICES, FETCH_ALL_BAD_INVOICES)])
  yield all([takeEvery(actions.FETCH_ALL_INVOICES, FETCH_ALL_INVOICES)])
  yield all([takeEvery(actions.FETCH_INVOICE_DETAILS, FETCH_INVOICE_DETAILS)])
  yield all([takeEvery(actions.FETCH_INVOICE_TIMELINE, FETCH_INVOICE_TIMELINE)])
}
