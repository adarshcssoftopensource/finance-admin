import actions from './actions'

const initialState = {
  currency: {
    loading: true,
  },
  country: {
    loading: true,
  },
}

export default function utilityReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
