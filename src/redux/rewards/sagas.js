import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/rewards'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_BUSINESS_EARN_REWARD_HISTORY({ businessId, data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      rewardEarnHistory: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchBusinessRewardEarnHistory, businessId, data)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        rewardEarnHistory: {
          loading: false,
          data: response?.result?.data || {},
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        rewardEarnHistory: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_BUSINESS_EARN_REWARD_HISTORY, FETCH_BUSINESS_EARN_REWARD_HISTORY),
  ])
}
