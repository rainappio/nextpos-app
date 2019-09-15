import React from 'react'
import { Platform } from 'react-native'
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
  Staff: Staff
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home'
  ,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-book'}
    />
  )
}

const LinksStack = createStackNavigator({
  Links: LinksScreen
})

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-book'}
    />
  )
}

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-book'}
    />
  )
}

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack
})
