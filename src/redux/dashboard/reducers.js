import actions from './actions'

const initialState = {
  userLoading: false,
  bizLoading: false,
}

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
