import actions from './actions'

const initialState = {
  allBanner: {
    loading: true,
  },
  allBannerTargets: {
    loading: true,
  },
  banner: {
    loading: true,
  },
}

export default function allBannerReducer(state = initialState, action) {
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
