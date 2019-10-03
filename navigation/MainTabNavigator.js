import React from 'react'
import { Platform, Text } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator
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

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Intro: IntroAppScreen,
  CreateAcc: CreateAccScreen,
  Login: Login,
  LoginSuccess: LoginSuccessScreen,
  ProductList: ProductListScreen,
  ProductForm: ProductFormScreen,
  Product: Product,
  Settings: SettingsScreen,
  ProductEdit: ProductEditScreen,
  Category: Category,
  CategoryList: CategoryListScreen,
  ProductsOverview: ProductsOverview,
  ClientUsers: ClientUsers,
  ClientUserLogin: ClientUserLogin,
  ClockIn: ClockIn,
  StaffsOverview: StaffsOverview,
  StaffEdit: StaffEditScreen,
  Staff: Staff,
  CategoryCustomize: CategoryCustomize
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={'md-home'} />
}

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  )
}

const TablesStack = createStackNavigator({
  Tables: TablesScreen
})

TablesStack.navigationOptions = {
  tabBarLabel: 'Tables',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-grid' : 'md-grid'}
    />
  )
}

const OrdersStack = createStackNavigator({
  Orders: OrdersScreen
})

OrdersStack.navigationOptions = {
  tabBarLabel: 'Orders',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="md-bookmark" size={32} />
  )
}

const ReservationStack = createStackNavigator({
  Reservation: ReservationScreen
})

ReservationStack.navigationOptions = {
  tabBarLabel: 'Reservation',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="ios-paper" size={32} />
  )
}

const ReportsStack = createStackNavigator({
  Reports: ReportsScreen
})

ReportsStack.navigationOptions = {
  tabBarLabel: 'Reports',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="md-paper" size={32} />
  )
}

export default createBottomTabNavigator({
  HomeStack: {
    screen: HomeStack,
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
          //return tabBarVisible
        })
        return { tabBarVisible }
      }
    }
  },
  TablesStack: {
    screen: TablesStack,
    navigationOptions: {
      headerTitle: 'Tables'
    }
  },
  OrdersStack: {
    screen: OrdersStack,
    navigationOptions: {
      headerTitle: 'Orders'
    }
  },
  ReservationStack: {
    screen: ReservationStack,
    navigationOptions: {
      headerTitle: 'Reservation'
    }
  },
  ReportsStack: {
    screen: ReportsStack,
    navigationOptions: {
      headerTitle: 'Reports'
    }
  },
  SettingsStack: {
    screen: SettingsStack,
    navigationOptions: {
      headerTitle: 'Settings'
    }
  }
})
