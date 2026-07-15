import actions from './actions'

const initialState = {
  plans: {
    loading: true,
  },
}

export default function plansReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, plans: { ...action.payload } }
    default:
      return state
  }
}
