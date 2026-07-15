import actions from './actions'

const initialState = {
  documents: {
    loading: true,
  },
}

export default function documentsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
