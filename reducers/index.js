import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import { reducer as authReducer } from './auth'
import { reducer as labelsReducer } from './labels'

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  labels: labelsReducer
})
export default rootReducer
