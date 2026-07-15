import actions from './actions'

const initialState = {
  loading: false,
  payoutChangeRequests: {
    loading: true,
  },
  payoutChangeRequest: {
    loading: true,
  },
}

export default function payoutChangeRequestsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
