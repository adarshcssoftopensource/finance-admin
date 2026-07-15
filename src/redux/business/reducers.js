import actions from './actions'

const initialState = {
  details: {
    loading: true,
  },
  businesses: {
    loading: true,
  },
  saleAgent: {
    loading: true,
  },
  businessNote: null,
  businessWebhookLog: {
    data: [],
    isLoading: false,
  },
  businessErrorLog: {
    data: [],
    isLoading: false,
  },
  capabilities: {
    loading: true,
  },
}

export default function businessReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, businesses: { ...action.payload } }
    case actions.GET_SALES_AGENT_SUCCESS:
      return { ...state, saleAgent: { ...action.payload } }
    case actions.SET_STATE_DETAIL: {
      return {
        ...state,
        details: { ...action.payload },
        businessNote: action.payload.data && action.payload.data.business.notes,
      }
    }
    case actions.LIST_BUSINESS_NOTES: {
      return {
        ...state,
        businessNote: action.payload.notes,
      }
    }
    case actions.SET_BUSINESS_CAPABILITIES: {
      return { ...state, capabilities: { ...action.payload } }
    }
    case actions.SET_BUSINESS_PAYMENT_SETTINGS: {
      return { ...state, paymentSettings: { ...action.payload } }
    }
    case actions.SET_BUSINESS_WEBHOOK_LOADING: {
      return {
        ...state,
        businessWebhookLog: {
          ...state.businessWebhookLog,
          isLoading: action.payload,
        },
      }
    }
    case actions.SET_BUSINESS_WEBHOOK_LOGS: {
      return {
        ...state,
        businessWebhookLog: {
          ...state.businessWebhookLog,
          isLoading: false,
          data: action.payload,
        },
      }
    }
    case actions.SET_BUSINESS_ERROR_LOADING: {
      return {
        ...state,
        businessErrorLog: {
          ...state.businessErrorLog,
          isLoading: action.payload,
        },
      }
    }
    case actions.SET_BUSINESS_ERROR_LOGS: {
      return {
        ...state,
        businessErrorLog: {
          ...state.businessErrorLog,
          isLoading: false,
          data: action.payload,
        },
      }
    }
    default:
      return state
  }
}
