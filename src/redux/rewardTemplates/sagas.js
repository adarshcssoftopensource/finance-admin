import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/rewardTemplates'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_REWARD_TEMPLATES({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      rewardTemplates: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllRewardTemplates, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        rewardTemplates: {
          loading: false,
          data: response?.result?.data || {},
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        rewardTemplates: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_REWARD_TEMPLATE({ templateId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      rewardTemplate: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchRewardTemplate, templateId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        rewardTemplate: {
          loading: false,
          data: response?.result?.data || {},
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        rewardTemplate: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* EDIT_REWARD_TEMPLATE({ templateId, data }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      rewardTemplates: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.editRewardTemplate, templateId, data)
  if (!response.error) {
    Notification.showSuccess(response?.result?.message)
    const fetchRewardTemplateResponse = yield call(Services.fetchAllRewardTemplates, {
      qryString: 'pageNo=1&pageSize=100&status=&keyword=',
    })
    if (!fetchRewardTemplateResponse.error) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          rewardTemplates: {
            loading: false,
            data: fetchRewardTemplateResponse?.result?.data || {},
          },
        },
      })
    }
  } else if (response.error) {
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_ALL_REWARD_TEMPLATES, FETCH_ALL_REWARD_TEMPLATES)])
  yield all([takeEvery(actions.FETCH_REWARD_TEMPLATE, FETCH_REWARD_TEMPLATE)])
  yield all([takeEvery(actions.EDIT_REWARD_TEMPLATE, EDIT_REWARD_TEMPLATE)])
}
