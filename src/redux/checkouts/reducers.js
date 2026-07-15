import actions from './actions'

const initialState = {
  checkouts: {
    loading: true,
  },
  checkoutTimeline: {
    loading: true,
  },
  checkout: {
    loading: true,
  },
}

export default function checkoutsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
