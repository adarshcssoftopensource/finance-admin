import actions from './actions'

const initialState = {
  blockStatus: {
    loading: false,
    data: null,
  },
}

export default function customersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
