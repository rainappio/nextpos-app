import { LOGGED_IN, LOGGED_OUT } from '../actions'

const initialState = {
  isLoggedIn: false
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true
      }
    case LOGGED_OUT:
      return initialState
    default:
      return state
  }
}
