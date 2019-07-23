import { LOGGED_IN, LOGGED_OUT } from '../actions'

const initialState = {
  isLoggedIn: false,
  token: undefined
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true,
        token: action.data
      }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}
