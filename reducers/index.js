import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import { reducer as authReducer } from './auth'
import { reducer as labelsReducer } from './labels'
import { reducer as productsReducer } from './products'
import { reducer as labelReducer } from './label'

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  labels: labelsReducer,
  products: productsReducer,
  label: labelReducer
})
export default rootReducer
