import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import { reducer as authReducer } from './auth'

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer
})
export default rootReducer
