import actions from './actions'

const initialState = {
  countries: {
    loading: true,
  },
  countryFees: {
    loading: true,
  },
}

export default function crmReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
