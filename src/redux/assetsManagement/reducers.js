import actions from './actions'

const initialState = {
  allAssets: {
    data: [],
    nextPage: '',
    loading: false,
  },
}

export default function allAssetsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
