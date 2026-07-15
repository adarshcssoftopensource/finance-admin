import actions from './actions'

const initialState = {
  systemSettings: {},
  isLoading: false,
}

export default function systemSettingsReducer(state = initialState, action) {
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
