/* eslint-disable */
import actions from './actions'

const initialState = {
  saleAgent: {
    loading: false,
    data: [],
  },
  allAgents: {
    loading: false,
    data: [],
  },
  payoutHistory: {
    loading: false,
    data: [],
  },
  error: null,
}

export default function agentReducer(state = initialState, action) {
  switch (action.type) {
    // Loading states
    case actions.CREATE_SALES_AGENT_REQUEST:
    case actions.GET_SALES_AGENT_LOADING:
    case actions.UPDATE_SALES_AGENT_REQUEST:
    case actions.DELETE_SALES_AGENT_REQUEST:
    case actions.GET_AGENTS_BY_BUSINESS_LOADING:
    case actions.REMOVE_MERCHANT_FROM_AGENT_REQUEST:
      return {
        ...state,
        saleAgent: { ...state.saleAgent, loading: true },
        error: null,
      }

    case actions.GET_ALL_SALES_AGENTS_LOADING:
      return {
        ...state,
        allAgents: { loading: true, data: [] },
        error: null,
      }

    case actions.GET_AGENT_PAYOUTS:
      return {
        ...state,
        payoutHistory: { ...state.payoutHistory, loading: true },
        error: null,
      }

    case actions.GET_AGENT_PAYOUTS_SUCCESS:
      return {
        ...state,
        payoutHistory: {
          loading: false,
          data: action.payload.data || [],
        },
        error: null,
      }

    case actions.LOG_AGENT_PAYOUT_SUCCESS:
      return {
        ...state,
        payoutHistory: {
          loading: false,
          data: [action.payload.data, ...(state.payoutHistory.data || [])],
        },
        error: null,
      }

    case actions.GET_AGENT_PAYOUTS_FAILURE:
    case actions.LOG_AGENT_PAYOUT_FAILURE:
      return {
        ...state,
        payoutHistory: { ...state.payoutHistory, loading: false },
        error: action.payload.message || 'Action failed',
      }

    case actions.CREATE_SALES_AGENT_SUCCESS:
      return {
        ...state,
        saleAgent: {
          loading: false,
          data: [...(state.saleAgent.data || []), action.payload.data],
        },
        error: null,
      }

    case actions.GET_SALES_AGENT_SUCCESS:
    case actions.UPDATE_SALES_AGENT_SUCCESS:
      return {
        ...state,
        saleAgent: {
          loading: false,
          data: state.saleAgent.data.map(agent =>
            String(agent._id) === String(action.payload.data._id) ? action.payload.data : agent,
          ),
        },
        error: null,
      }

    case actions.GET_AGENTS_BY_BUSINESS_SUCCESS:
      return {
        ...state,
        saleAgent: { loading: false, data: action.payload.data || [] },
        error: null,
      }

    case actions.DELETE_SALES_AGENT_SUCCESS:
      return {
        ...state,
        saleAgent: {
          loading: false,
          data: (state.saleAgent.data || []).filter(
            agent => String(agent._id) !== String(action.payload.agentId),
          ),
        },
        error: null,
      }

    case actions.REMOVE_MERCHANT_FROM_AGENT_SUCCESS:
      return {
        ...state,
        saleAgent: {
          loading: false,
          data: (state.saleAgent.data || []).map(agent => {
            if (String(agent._id) === String(action.payload.agentId)) {
              return {
                ...agent,
                merchants: (agent.merchants || []).filter(
                  m =>
                    String(m.businessId) !== String(action.payload.businessId) &&
                    String(m.businessId?._id) !== String(action.payload.businessId),
                ),
              }
            }
            return agent
          }),
        },
        error: null,
      }

    case actions.GET_ALL_SALES_AGENTS_SUCCESS:
      return {
        ...state,
        allAgents: {
          loading: false,
          data: action.payload.data || [],
        },
        error: null,
      }

    // Failure states
    case actions.CREATE_SALES_AGENT_FAILURE:
      return {
        ...state,
        saleAgent: { ...state.saleAgent, loading: false },
        error: 'Failed to create sales agent',
      }

    case actions.GET_SALES_AGENT_FAILURE:
      return {
        ...state,
        saleAgent: { ...state.saleAgent, loading: false },
        error: 'Failed to fetch sales agent',
      }

    case actions.UPDATE_SALES_AGENT_FAILURE:
      return {
        ...state,
        saleAgent: { ...state.saleAgent, loading: false },
        error: 'Failed to update sales agent',
      }

    case actions.DELETE_SALES_AGENT_FAILURE:
      return {
        ...state,
        saleAgent: { ...state.saleAgent, loading: false },
        error: 'Failed to delete sales agent',
      }

    case actions.REMOVE_MERCHANT_FROM_AGENT_FAILURE:
      return {
        ...state,
        saleAgent: { ...state.saleAgent, loading: false },
        error: 'Failed to remove merchant from agent',
      }

    case actions.GET_ALL_SALES_AGENTS_FAILURE:
      return {
        ...state,
        allAgents: { loading: false, data: [] },
        error: 'Failed to fetch all sales agents',
      }

    default:
      return state
  }
}
