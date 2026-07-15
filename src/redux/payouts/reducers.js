import actions from './actions'

const initialState = {
  payouts: {
    loading: true,
  },
  payout: {
    loading: true,
  },
}

export default function payoutsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
