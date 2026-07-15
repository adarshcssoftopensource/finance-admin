import actions from './actions'

const initialState = {
  walletLedger: {
    loading: true,
  },
  walletSummary: {
    loading: true,
  },
}

export default function allWalletLedgerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
