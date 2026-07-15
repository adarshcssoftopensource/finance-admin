import actions from './actions'

const initialState = {
  peyme: {
    loading: true,
  },
  payment: {
    loading: true,
  },
}

export default function peymeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
