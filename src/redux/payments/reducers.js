import actions from './actions'

const initialState = {
  payments: {
    loading: true,
  },
  payment: {
    loading: true,
  },
}

export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
