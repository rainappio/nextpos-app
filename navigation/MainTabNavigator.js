import React from 'react'
import { Platform, Text, AsyncStorage } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import {
  NavigationActions,
  StackActions,
  createSwitchNavigator
} from 'react-navigation'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'
import IntroAppScreen from '../screens/IntroAppScreen'
import CreateAccScreen from '../screens/CreateAccScreen'
import Login from '../screens/Login'
import LoginSuccessScreen from '../screens/LoginSuccessScreen'
import ProductListScreen from '../screens/ProductListScreen'
import ProductFormScreen from '../screens/ProductFormScreen'
import Product from '../screens/Product'
import ProductEditScreen from '../screens/ProductEditScreen'
import Category from '../screens/Category'
import ProductsOverview from '../screens/ProductsOverview'
import ClientUsers from '../screens/ClientUsers'
import ClientUserLogin from '../screens/ClientUserLogin'
import ClockIn from '../screens/ClockIn'
import StaffsOverview from '../screens/StaffsOverview'
import StaffEditScreen from '../screens/StaffEditScreen'
import Staff from '../screens/Staff'
import TablesScreen from '../screens/TablesScreen'
import OrdersScreen from '../screens/OrdersScreen'
import ReservationScreen from '../screens/ReservationScreen'
import ReportsScreen from '../screens/ReportsScreen'
import CategoryCustomize from '../screens/CategoryCustomize'
import LoginScreen from '../screens/LoginScreen'
import OptionFormScreen from '../screens/OptionFormScreen'
import Option from '../screens/Option'
import AccountScreen from '../screens/AccountScreen'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Colors from '../constants/Colors'
import OrderStart from '../screens/OrderStart'
import OrderForm from '../screens/OrderForm'
import OrderFormII from '../screens/OrderFormII'
import OrderFormIII from '../screens/OrderFormIII'
import OrderFormIV from '../screens/OrderFormIV'
import OrdersSummary from '../screens/OrdersSummary'
import Store from '../screens/Store'
import OptionEdit from '../screens/OptionEdit'
import PrinternKDS from '../screens/PrinternKDS'
import PrinterAdd from '../screens/PrinterAdd'
import PrinterEdit from '../screens/PrinterEdit'
import WorkingAreaAdd from '../screens/WorkingAreaAdd'
import WorkingAreaEdit from '../screens/WorkingAreaEdit'
import ShiftClose from '../screens/ShiftClose'
import LIneItemEdit from '../screens/LIneItemEdit'
import TableLayouts from '../screens/TableLayouts'
import TableLayoutEdit from '../screens/TableLayoutEdit'
import TableLayoutAdd from '../screens/TableLayoutAdd'
import TableAdd from '../screens/TableAdd'
import TableEdit from '../screens/TableEdit'
import Payment from '../screens/Payment'
import PaymentOrder from '../screens/PaymentOrder'
import CheckoutComplete from '../screens/CheckoutComplete'
import Sales from '../screens/Sales'
import SalesCharts from '../screens/SalesCharts'
import OrderDetail from '../screens/OrderDetail'
import Announcements from '../screens/Announcements'
import AnnouncementsAdd from '../screens/AnnouncementsAdd'
import AnnouncementsEdit from '../screens/AnnouncementsEdit'
import PasswordReset from '../screens/PasswordReset'
import StaffTimeCard from '../screens/StaffTimeCard'
import UserTimeCards from '../screens/UserTimeCards'
import UserTimeCardDetail from '../screens/UserTimeCardDetail'
import CloseComplete from '../screens/CloseComplete'
import AccountClose from '../screens/AccountClose'
import AccountCloseConfirm from '../screens/AccountCloseConfirm'

const Home = createStackNavigator({
  LoginSuccess: LoginSuccessScreen,
  ClientUsers: ClientUsers,
  ClientUserLogin: ClientUserLogin,
  ClockIn: ClockIn,
  PasswordReset: PasswordReset
})
Home.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('menu.home'),
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-home'} />
  )
})

const Settings = createStackNavigator({
  SettingScr: SettingsScreen,
  Account: AccountScreen,
  Store: Store,
  ProductList: ProductListScreen,
  ProductForm: ProductFormScreen,
  Product: Product,
  ProductEdit: ProductEditScreen,
  ProductsOverview: ProductsOverview,
  Staff: Staff,
  StaffEdit: StaffEditScreen,
  StaffsOverview: StaffsOverview,
  OptionScreen: OptionFormScreen,
  Option: Option,
  OptionEdit: OptionEdit,
  Category: Category,
  CategoryCustomize: CategoryCustomize,
  ClientUsers: ClientUsers,
  ClientUserLoginS: ClientUserLogin,
  LoginSuccess: LoginSuccessScreen,
  PrinternKDS: PrinternKDS,
  PrinterAdd: PrinterAdd,
  PrinterEdit: PrinterEdit,
  WorkingAreaAdd: WorkingAreaAdd,
  WorkingAreaEdit: WorkingAreaEdit,
  ShiftClose: ShiftClose,
  TableLayouts: TableLayouts,
  TableLayoutAdd: TableLayoutAdd,
  TableLayoutEdit: TableLayoutEdit,
  TableAdd: TableAdd,
  TableEdit: TableEdit,
  Announcements: Announcements,
  AnnouncementsAdd: AnnouncementsAdd,
  AnnouncementsEdit: AnnouncementsEdit,
  CloseComplete: CloseComplete,
  AccountClose: AccountClose,
  AccountCloseConfirm: AccountCloseConfirm
})
Settings.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('menu.settings'),
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  )
})

const Tables = createStackNavigator({
  TablesSrc: TablesScreen,
  OrderStart: OrderStart,
  NewOrderForm: OrderForm,
  OrderFormII: OrderFormII,
  OrderFormIII: OrderFormIII,
  OrderFormIV: OrderFormIV,
  OrdersSummary: OrdersSummary,
  LIneItemEdit: LIneItemEdit,
  Payment: Payment,
  PaymentOrder: PaymentOrder,
  CheckoutComplete: CheckoutComplete
})
Tables.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('menu.tables'),
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="md-people" />
  )
})

const Orders = createStackNavigator({
  Orders: OrdersScreen,
  OrderDetail: OrderDetail
})
Orders.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('menu.orders'),
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="md-document" />
  )
})

const Reservation = createStackNavigator({
  Reservation: ReservationScreen
})
Reservation.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('menu.reservations'),
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="ios-calendar" />
  )
})

const Reports = createStackNavigator({
  Reports: ReportsScreen,
  Sales: Sales,
  SalesCharts: SalesCharts,
  StaffTimeCard: StaffTimeCard,
  UserTimeCards: UserTimeCards,
  UserTimeCardDetail: UserTimeCardDetail
})
Reports.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('menu.reporting'),
  tabBarIcon: ({ focused }) => (
    <FontAwesomeIcon
      focused={focused}
      name="bar-chart"
      size={32}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  )
})

const tabBar = createBottomTabNavigator({
  Home: {
    screen: Home,
    /*navigationOptions: ({ navigation, screenProps: { t } }) => {
      if (navigation.state.routes.length > 0) {
        navigation.state.routes.map(route => {
          if (
            route.routeName === 'Home' ||
            route.routeName === 'Intro' ||
            route.routeName === 'Login' ||
            route.routeName === 'PasswordReset'
          ) {
            tabBarVisible = false
          } else {
            tabBarVisible = true
          }
        })
        return { title: '', tabBarVisible }
      }
    }*/
  },
  Tables: {
    screen: Tables
  },
  Orders: {
    screen: Orders
  },
  Reports: {
    screen: Reports
  },
  Settings: {
    screen: Settings
  }
}, {
  defaultNavigationOptions: {
    tabBarOnPress: ({navigation, defaultHandler}) => {
      navigation.dispatch(StackActions.popToTop())

      /*navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: navigation.state.routes[0].key,
          actions: [
            NavigationActions.navigate({
              routeName: navigation.state.routes[0].routeName
            })
          ]
        })
      )*/
      defaultHandler()
    }
  },
  tabBarOptions: {
    showLabel: false,
    tabStyle: {
      backgroundColor: '#f5f5f5'
    }
  }
})

export default createSwitchNavigator({
  Home: HomeScreen,
  Intro: IntroAppScreen,
  CreateAcc: CreateAccScreen,
  Login: Login,
  LoginScreen: LoginScreen,
  tabBar: {
    screen: tabBar // Calling the tabNavigator, wich contains the other stackNavigators
  }
})
