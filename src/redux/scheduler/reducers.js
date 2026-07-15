import actions from './actions'

const initialState = {
  loading: false,
  schedulers: [],
}

export default function schedulerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.START_SCHEDULER_LOADING: {
      return { ...state, loading: true }
    }
    case actions.STOP_SCHEDULER_LOADING: {
      return { ...state, loading: false }
    }
    case actions.SET_STATE:
      return { ...state, loading: false, ...action.payload }
    default:
      return state
  }
}
