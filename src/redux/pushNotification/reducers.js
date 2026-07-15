import actions from './actions'

const initialState = {
  pushNotifications: {
    loading: true,
  },
  singleNotification: {
    loading: true,
  },
}

export default function pushNotificationReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
