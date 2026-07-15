import actions from './actions'

const initialState = {
  webhookLogs: {
    data: [],
    isLoading: false,
  },
  errorLogs: {
    data: [],
    isLoading: false,
  },
}

export default function logsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_WEBHOOK_LOADING: {
      return {
        ...state,
        webhookLogs: {
          ...state.webhookLogs,
          isLoading: action.payload,
        },
      }
    }
    case actions.SET_WEBHOOK_LOGS: {
      return {
        ...state,
        webhookLogs: {
          ...state.webhookLogs,
          isLoading: false,
          data: action.payload,
        },
      }
    }
    case actions.SET_ERROR_LOADING: {
      return {
        ...state,
        errorLogs: {
          ...state.errorLogs,
          isLoading: action.payload,
        },
      }
    }
    case actions.SET_ERROR_LOGS: {
      return {
        ...state,
        errorLogs: {
          ...state.errorLogs,
          isLoading: false,
          data: action.payload,
        },
      }
    }
    default:
      return state
  }
}
