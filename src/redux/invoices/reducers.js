import actions from './actions'

const initialState = {
  badInvoices: {
    loading: true,
  },
  invoices: {
    loading: true,
  },
  invoice: {
    loading: true,
  },
  invoiceTimeline: {
    loading: true,
  },
}

export default function invoicesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
