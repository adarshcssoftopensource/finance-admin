import actions from './actions'

const initialState = {
  userDevices: {
    loading: true,
  },
}

export default function userDevicesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
