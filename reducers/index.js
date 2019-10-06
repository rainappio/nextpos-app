import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import { reducer as authReducer } from './auth'
import { reducer as labelsReducer } from './labels'
import { reducer as productsReducer } from './products'
import { reducer as labelReducer } from './label'
import { reducer as productReducer } from './product'
import { reducer as clientusersReducer } from './clientusers'
import { reducer as clientuserReducer } from './clientuser'
import { reducer as productoptionReducer } from './productoption'
import { reducer as workingareasReducer } from './workingareas'
import { reducer as productoptionsReducer } from './productoptions'

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  labels: labelsReducer,
  products: productsReducer,
  label: labelReducer,
  product: productReducer,
  clientusers: clientusersReducer,
  clientuser: clientuserReducer,
  productoption: productoptionReducer,
  workingareas: workingareasReducer,
  prodctsoptions: productoptionsReducer
})
export default rootReducer
