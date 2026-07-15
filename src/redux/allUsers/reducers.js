import actions from './actions'

const initialState = {
  allUsers: {
    loading: true,
  },
  user: {
    loading: true,
  },
  userNote: null,
  userSession: {},
  userToken: {
    loading: true,
    token: null,
  },
}

export default function allUsersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE: {
      return {
        ...state,
        ...action.payload,
        userNote: action.payload.user?.data?.user?.notes,
      }
    }
    case actions.LIST_USERS_NOTES: {
      return {
        ...state,
        userNote: action.payload.notes,
      }
    }
    case actions.START_FETCH_USER_SESSION: {
      return {
        ...state,
        userSession: { loading: true },
      }
    }
    case actions.SET_USER_SESSION: {
      return {
        ...state,
        userSession: { ...(action.payload.data ?? {}), loading: false },
      }
    }
    default:
      return state
  }
}
