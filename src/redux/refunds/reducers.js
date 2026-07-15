import actions from './actions'

const initialState = {
  refunds: {
    loading: true,
  },
  refund: {
    loading: true,
  },
}

export default function refundsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
