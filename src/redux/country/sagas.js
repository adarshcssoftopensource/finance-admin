import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/country'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_COUNTRY({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      countries: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchCountries, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        countries: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        countries: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_COUNTRY_FEES_BY_COUNTRY_ID({ payload: qryData }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      countryFees: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchCountryFeesByCountryId, qryData.countryId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        countryFees: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        countryFees: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_ONBOARDING_SCHEMA() {
  const response = yield call(Services.fetchOnboardingSchema)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        onBoardingSchema: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_COUNTRIES, FETCH_COUNTRY)])
  yield all([takeEvery(actions.FETCH_COUNTRY_FEES_BY_COUNTRY_ID, FETCH_COUNTRY_FEES_BY_COUNTRY_ID)])
  yield all([takeEvery(actions.FETCH_ONBOARDING_SCHEMA, FETCH_ONBOARDING_SCHEMA)])
}
