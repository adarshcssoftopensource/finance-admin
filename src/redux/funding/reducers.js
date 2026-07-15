import actions from './actions'

const initialState = {
  fundingLinks: {
    loading: true,
  },
}

export default function fundingReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
