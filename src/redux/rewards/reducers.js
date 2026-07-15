import actions from './actions'

const initialState = {
  rewardEarnHistory: {
    loading: true,
  },
}

export default function rewardsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
