import actions from './actions'

const initialState = {
  subscriptions: {
    loading: true,
  },
  subscription: {
    loading: true,
  },
  payments: {
    loading: true,
  },
}

export default function allSubscriptionsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
