import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import { reducer as authReducer } from './auth'
import { reducer as clientReducer } from './client'
import { reducer as labelsReducer } from './labels'
import { reducer as productsReducer } from './products'
import { reducer as labelReducer } from './label'
import { reducer as productReducer } from './product'
import { reducer as clientusersReducer } from './clientusers'
import { reducer as clientuserReducer } from './clientuser'
import { reducer as productoptionReducer } from './productoption'
import { reducer as workingareasReducer } from './workingareas'
import { reducer as productoptionsReducer } from './productoptions'
import { reducer as tablelayoutsReducer } from './tablelayouts'
import { reducer as tablelayoutReducer } from './tablelayout'
import { reducer as shiftReducer } from './shift'
import { reducer as ordersinflightReducer } from './ordersinflight'
import { reducer as orderReducer } from './order'
import { reducer as printersReducer } from './printers'
import { reducer as printerReducer } from './printer'
import { reducer as workingareaReducer } from './workingarea'
import { reducer as tablesavailableReducer } from './tablesavailable'
import { reducer as globalorderoffersReducer } from './globalorderoffers'
import { reducer as rangedsalesreportReducer } from './rangedsalesreport'
import { reducer as ordersbydaterangeReducer } from './ordersbydaterange'
import { reducer as salesDistributionReportReducer } from './salesdistributionreport'
import { reducer as customerCountRepoertReducer } from './customercountreport'
import { reducer as announcementsReducer } from './announcements'
import { reducer as announcementReducer } from './announcement'
import { reducer as timecardsReducer } from './timecards'
import { reducer as usertimeCardsReducer } from './usertimecards'
import { reducer as timecardReducer } from './timecard'

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  client: clientReducer,
  labels: labelsReducer,
  products: productsReducer,
  label: labelReducer,
  product: productReducer,
  clientusers: clientusersReducer,
  clientuser: clientuserReducer,
  productoption: productoptionReducer,
  workingareas: workingareasReducer,
  prodctsoptions: productoptionsReducer,
  tablelayouts: tablelayoutsReducer,
  tablelayout: tablelayoutReducer,
  shift: shiftReducer,
  ordersinflight: ordersinflightReducer,
  order: orderReducer,
  printers: printersReducer,
  printer: printerReducer,
  workingarea: workingareaReducer,
  tablesavailable: tablesavailableReducer,
  globalorderoffers: globalorderoffersReducer,
  getrangedsalesreport: rangedsalesreportReducer,
  ordersbydaterange: ordersbydaterangeReducer,
  salesdistributionreport: salesDistributionReportReducer,
  customercountreport: customerCountRepoertReducer,
  announcements: announcementsReducer,
  announcement: announcementReducer,
  timecards: timecardsReducer,
	usertimecards: usertimeCardsReducer,
	timecard: timecardReducer
})
export default rootReducer
