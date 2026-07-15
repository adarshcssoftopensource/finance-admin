import actions from './actions'

const initialState = {
  stats: {
    loading: false,
    data: null,
  },
  signups: {
    loading: false,
    data: null,
    error: null,
  },
  allWallets: {
    loading: false,
    data: null,
  },
  allTransactions: {
    loading: false,
    data: null,
  },
}

export default function financeWalletReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
