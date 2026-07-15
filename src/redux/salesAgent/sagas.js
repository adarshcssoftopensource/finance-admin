/* eslint-disable */
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { message, notification } from 'antd'
import {
  createSalesAgent,
  updateSalesAgent,
  getAllSalesAgents,
  deleteSalesAgent,
  removeMerchantFromAgent,
  getSalesAgentsByBusinessId,
  logAgentPayout,
  getAgentPayouts,
  getSalesAgentById,
  assignSalesAgentToBusiness,
  assumeAgent,
} from 'services/salesAgent'
import actions from './actions'

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

export function* CREATE_SALES_AGENT({ payload }) {
  try {
    const { callback, businessId, ...data } = payload
    yield put({ type: actions.CREATE_SALES_AGENT_REQUEST, payload: { loading: true } })

    const response = yield call(createSalesAgent, { ...data, businessId })
    if (response?.error) throw response

    yield put({
      type: actions.CREATE_SALES_AGENT_SUCCESS,
      payload: { loading: false, data: response?.data?.agent },
    })

    if (businessId) {
      yield put({
        type: actions.GET_AGENTS_BY_BUSINESS,
        payload: { businessId },
      })
    } else {
      yield put({ type: actions.GET_ALL_SALES_AGENTS })
    }

    showSuccess('Sales agent created successfully')
    if (callback) callback()
  } catch (error) {
    yield put({ type: actions.CREATE_SALES_AGENT_FAILURE, payload: { loading: false } })
    showError(error?.message || 'Failed to create sales agent')
  }
}

export function* ASSIGN_SALES_AGENT({ payload }) {
  try {
    const { agentId, businessId } = payload

    yield put({
      type: actions.ASSIGN_SALES_AGENT_REQUEST,
      payload: { loading: true },
    })

    const response = yield call(assignSalesAgentToBusiness, agentId, businessId)

    if (response?.error) throw response

    yield put({
      type: actions.ASSIGN_SALES_AGENT_SUCCESS,
      payload: { loading: false },
    })

    yield put({
      type: actions.GET_AGENTS_BY_BUSINESS,
      payload: { businessId },
    })

    showSuccess('Sales agent assigned successfully')
  } catch (error) {
    yield put({
      type: actions.ASSIGN_SALES_AGENT_FAILURE,
      payload: { loading: false },
    })
    showError(error?.message || 'Failed to assign sales agent')
  }
}

export function* UPDATE_SALES_AGENT({ payload }) {
  try {
    const { agentId, data, callback } = payload
    const { businessId } = data
    yield put({ type: actions.UPDATE_SALES_AGENT_REQUEST, payload: { loading: true } })

    const response = yield call(updateSalesAgent, agentId, { ...data, businessId })
    if (response?.error) throw response

    yield put({
      type: actions.UPDATE_SALES_AGENT_SUCCESS,
      payload: { loading: false, data: response?.data?.agent },
    })

    if (businessId) {
      yield put({
        type: actions.GET_AGENTS_BY_BUSINESS,
        payload: { businessId },
      })
    } else {
      yield put({ type: actions.GET_ALL_SALES_AGENTS })
    }

    showSuccess('Sales agent updated successfully')
    if (callback) callback()
  } catch (error) {
    yield put({ type: actions.UPDATE_SALES_AGENT_FAILURE, payload: { loading: false } })
    showError(error?.message || 'Failed to update sales agent')
  }
}

export function* GET_ALL_SALES_AGENTS() {
  try {
    yield put({
      type: actions.GET_ALL_SALES_AGENTS_LOADING,
      payload: { loading: true },
    })

    const response = yield call(getAllSalesAgents)

    if (response?.error) throw response

    yield put({
      type: actions.GET_ALL_SALES_AGENTS_SUCCESS,
      payload: {
        data: response?.data?.agents || [],
      },
    })
  } catch (error) {
    yield put({
      type: actions.GET_ALL_SALES_AGENTS_FAILURE,
      payload: { loading: false },
    })
    showError(error?.message || 'Failed to fetch sales agents')
  }
}

export function* DELETE_SALES_AGENT({ payload }) {
  try {
    const { agentId } = payload
    yield put({ type: actions.DELETE_SALES_AGENT_REQUEST, payload: { loading: true } })

    const response = yield call(deleteSalesAgent, agentId)
    if (response?.error) throw response

    yield put({
      type: actions.DELETE_SALES_AGENT_SUCCESS,
      payload: { agentId: String(agentId) },
    })

    message.success('Sales agent deleted successfully')
  } catch (error) {
    yield put({ type: actions.DELETE_SALES_AGENT_FAILURE, payload: { loading: false } })
    message.error(error?.message || 'Failed to delete sales agent')
  }
}

export function* REMOVE_MERCHANT_FROM_AGENT({ payload }) {
  try {
    const { agentId, businessId } = payload

    yield put({
      type: actions.REMOVE_MERCHANT_FROM_AGENT_REQUEST,
      payload: { loading: true },
    })

    const response = yield call(removeMerchantFromAgent, agentId, businessId)
    if (response?.error) throw response

    yield put({
      type: actions.REMOVE_MERCHANT_FROM_AGENT_SUCCESS,
      payload: {
        agentId: String(agentId),
        businessId: String(businessId),
      },
    })

    message.success('Merchant removed from sales agent successfully')
  } catch (error) {
    yield put({
      type: actions.REMOVE_MERCHANT_FROM_AGENT_FAILURE,
      payload: { loading: false },
    })
    message.error(error?.message || 'Failed to remove merchant from agent')
  }
}

export function* GET_SALES_AGENT({ payload }) {
  try {
    yield put({ type: actions.GET_SALES_AGENT_LOADING, payload: { loading: true } })

    const response = yield call(getSalesAgentById, payload.id)
    if (!response?.error) {
      yield put({
        type: actions.GET_SALES_AGENT_SUCCESS,
        payload: { loading: false, data: response?.data?.agent },
      })
    }
  } catch (error) {
    yield put({ type: actions.GET_SALES_AGENT_FAILURE, payload: { loading: false } })
    showError(error?.message || 'Failed to get sales agent')
  }
}

export function* ASSUME_AGENT({ payload }) {
  const { agentId } = payload
  const newWindow = window.open()
  try {
    const response = yield call(assumeAgent, agentId)
    if (response && !response.error) {
      newWindow.location = `${process.env.REACT_APP_AGENT_URL}/#/auth/login/${response.data.refreshToken}`
    } else {
      newWindow.close()
      showError(response?.message || 'Failed to assume agent')
    }
  } catch (error) {
    if (newWindow) newWindow.close()
    showError(error?.message || 'Failed to assume agent')
  }
}

export function* GET_AGENTS_BY_BUSINESS({ payload }) {
  try {
    yield put({ type: actions.GET_AGENTS_BY_BUSINESS_LOADING, payload: { loading: true } })

    const response = yield call(getSalesAgentsByBusinessId, payload.businessId)

    if (!response?.error) {
      yield put({
        type: actions.GET_AGENTS_BY_BUSINESS_SUCCESS,
        payload: { loading: false, data: response?.data?.agents || [] },
      })
    } else {
      throw response
    }
  } catch (error) {
    yield put({ type: actions.GET_AGENTS_BY_BUSINESS_FAILURE, payload: { loading: false } })
    showError(error?.message || 'Failed to fetch sales agents')
  }
}

export function* LOG_AGENT_PAYOUT({ payload }) {
  const { agentId, data, callback } = payload
  const response = yield call(logAgentPayout, agentId, data)
  if (response.statusCode === 200) {
    notification.success({
      message: 'Success',
      description: 'Payout logged successfully',
    })
    yield put({
      type: actions.LOG_AGENT_PAYOUT_SUCCESS,
      payload: response.data,
    })
    if (callback) callback()
    yield put({
      type: actions.GET_AGENT_PAYOUTS,
      payload: { agentId },
    })
  } else {
    notification.error({
      message: 'Error',
      description: response.message || 'Failed to log payout',
    })
    yield put({
      type: actions.LOG_AGENT_PAYOUT_FAILURE,
      payload: { message: response.message },
    })
  }
}

export function* GET_AGENT_PAYOUTS({ payload }) {
  const { agentId } = payload
  const response = yield call(getAgentPayouts, agentId)
  if (response.statusCode === 200) {
    yield put({
      type: actions.GET_AGENT_PAYOUTS_SUCCESS,
      payload: { data: response.data.payouts },
    })
  } else {
    yield put({
      type: actions.GET_AGENT_PAYOUTS_FAILURE,
      payload: { message: response.message },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_SALES_AGENT, CREATE_SALES_AGENT),
    takeEvery(actions.GET_SALES_AGENT, GET_SALES_AGENT),
    takeEvery(actions.UPDATE_SALES_AGENT, UPDATE_SALES_AGENT),
    takeEvery(actions.DELETE_SALES_AGENT, DELETE_SALES_AGENT),
    takeEvery(actions.GET_AGENTS_BY_BUSINESS, GET_AGENTS_BY_BUSINESS),
    takeEvery(actions.GET_ALL_SALES_AGENTS, GET_ALL_SALES_AGENTS),
    takeEvery(actions.ASSIGN_SALES_AGENT, ASSIGN_SALES_AGENT),
    takeEvery(actions.REMOVE_MERCHANT_FROM_AGENT, REMOVE_MERCHANT_FROM_AGENT),
    takeEvery(actions.LOG_AGENT_PAYOUT, LOG_AGENT_PAYOUT),
    takeEvery(actions.GET_AGENT_PAYOUTS, GET_AGENT_PAYOUTS),
    takeEvery(actions.ASSUME_AGENT, ASSUME_AGENT),
  ])
}
