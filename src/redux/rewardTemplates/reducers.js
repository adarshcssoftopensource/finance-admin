import actions from './actions'

const initialState = {
  rewardTemplates: {
    loading: true,
  },
  rewardTemplate: {
    loading: true,
  },
}

export default function rewardTemplatesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
