import actions from './actions'

const initialState = {
  disputes: {
    loading: true,
  },
  dispute: {
    loading: true,
  },
}

export default function disputesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
