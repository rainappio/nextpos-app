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
import CategoryListScreen from '../screens/CategoryListScreen'
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

const Home = createStackNavigator({
  LoginSuccess: LoginSuccessScreen,
  Login: Login,
  LoginScreen: LoginScreen,
  ClientUsers: ClientUsers,
  ClientUserLogin: ClientUserLogin,
  ClockIn: ClockIn
})
Home.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-home'} />
  ),
  tabBarOptions: {
    activeTintColor: '#f18d1a'
  },
  tabBarOnPress: ({ navigation, defaultHandler }) => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: navigation.state.routes[0].key,
        actions: [
          NavigationActions.navigate({
            routeName: navigation.state.routes[0].routeName
          })
        ]
      })
    )
    navigation.navigate('LoginSuccess')
    defaultHandler()
  }
}

const Settings = createStackNavigator({
  SettingScr: SettingsScreen,
  Account: AccountScreen,
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
  Category: Category,
  CategoryList: CategoryListScreen,
  CategoryCustomize: CategoryCustomize,
  ClientUsers: ClientUsers,
  ClientUserLoginS: ClientUserLogin,
  LoginSuccess: LoginSuccessScreen
})
Settings.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  ),
  tabBarOptions: {
    activeTintColor: '#f18d1a'
  },
  tabBarOnPress: ({ navigation, defaultHandler }) => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: navigation.state.routes[0].key,
        actions: [
          NavigationActions.navigate({
            routeName: navigation.state.routes[0].routeName
          })
        ]
      })
    )
    navigation.navigate('SettingScr')
    //navigation.dispatch(StackActions.popToTop())
    defaultHandler()
  }
}

const Tables = createStackNavigator({
  Tables: TablesScreen,
  OrderStart: OrderStart,
  NewOrderForm: OrderForm,
  OrderFormII: OrderFormII,
  OrderFormIII: OrderFormIII,
  OrderFormIV: OrderFormIV,
  OrdersSummary: OrdersSummary
})
Tables.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="md-people" />
  ),
  tabBarOptions: {
    activeTintColor: '#f18d1a'
  }
}

const Orders = createStackNavigator({
  Orders: OrdersScreen
})
Orders.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="md-document" size={32} />
  ),
  tabBarOptions: {
    activeTintColor: '#f18d1a'
  }
}

const Reservation = createStackNavigator({
  Reservation: ReservationScreen
})
Reservation.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="ios-calendar" size={32} />
  ),
  tabBarOptions: {
    activeTintColor: '#f18d1a'
  }
}

const Reports = createStackNavigator({
  Reports: ReportsScreen
})
Reports.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <FontAwesomeIcon
      focused={focused}
      name="bar-chart"
      size={22}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
  tabBarOptions: {
    activeTintColor: '#f18d1a'
  }
}

var tabBar = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      if (navigation.state.routes.length > 0) {
        navigation.state.routes.map(route => {
          if (
            route.routeName === 'Home' ||
            route.routeName === 'Intro' ||
            route.routeName === 'Login'
          ) {
            tabBarVisible = false
          } else {
            tabBarVisible = true
          }
        })
        return { tabBarVisible }
      }
    }
  },
  Tables: {
    screen: Tables
  },
  Orders: {
    screen: Orders
  },
  Reservation: {
    screen: Reservation
  },
  Reports: {
    screen: Reports
  },
  Settings: {
    screen: Settings
  }
})

export default createSwitchNavigator({
  Home: HomeScreen,
  Intro: IntroAppScreen,
  CreateAcc: CreateAccScreen,
  tabBar: {
    screen: tabBar // Calling the tabNavigator, wich contains the other stackNavigators
  }
})
