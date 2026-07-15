import actions from './actions'

const initialState = {
  debitCards: {
    loading: true,
  },
  debitCard: {
    loading: true,
  },
  walletTransactions: {
    loading: true,
  },
}

export default function debitCardsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
