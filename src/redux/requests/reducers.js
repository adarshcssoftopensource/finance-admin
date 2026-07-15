import actions from './actions'

const initialState = {
  loading: false,
  allRequests: {
    loading: true,
  },
  request: {
    loading: true,
  },
}

export default function requestsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
