import React from 'react'
import {AsyncStorage, Platform, Text, useWindowDimensions, View, TouchableOpacity} from 'react-native'
import Animated from 'react-native-reanimated';
import {handleRefreshToken} from "../helpers/loginActions";
import NavigationService from "../navigation/NavigationService";
import {StackActions, TabActions, CommonActions, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createBottomTabNavigator, BottomTabBar, useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import {createCompatNavigatorFactory, createSwitchNavigator} from '@react-navigation/compat';
import TabBarIcon from '../components/TabBarIcon'
import Icon from 'react-native-vector-icons/Ionicons'
import HomeScreen from '../screens/HomeScreen'
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
import TableLayouts from '../screens/TableLayouts'
import TableLayoutEdit from '../screens/TableLayoutEdit'
import TableLayoutAdd from '../screens/TableLayoutAdd'
import TableAdd from '../screens/TableAdd'
import TableEdit from '../screens/TableEdit'
import Payment from '../screens/Payment'
import PaymentOrder from '../screens/PaymentOrder'
import CheckoutComplete from '../screens/CheckoutComplete'
import SalesCharts from '../screens/SalesCharts'
import OrderDetail from '../screens/OrderDetail'
import Announcements from '../screens/Announcements'
import AnnouncementsAdd from '../screens/AnnouncementsAdd'
import AnnouncementsEdit from '../screens/AnnouncementsEdit'
import PasswordReset from '../screens/PasswordReset'
import StaffTimeCard from '../screens/StaffTimeCard'
import UserTimeCards from '../screens/UserTimeCards'
import CloseComplete from '../screens/CloseComplete'
import AccountClose from '../screens/AccountClose'
import AccountCloseConfirm from '../screens/AccountCloseConfirm'
import CustomerStats from "../screens/CustomerStats";
import ShiftHistory from "../screens/ShiftHistory";
import ShiftDetails from "../screens/ShiftDetails";
import {getToken} from "../constants/Backend";
import ManageVisualScreen from '../screens/ManageVisualScreen'
import UpdateOrder from "../screens/UpdateOrder";
import EditUserRole from '../screens/EditUserRole'
import NewUserRole from '../screens/NewUserRole'
import ManageUserRole from '../screens/ManageUserRole'
import ManageOffers from '../screens/ManageOffers'
import EinvoiceSettingScreen from '../screens/EinvoiceSettingScreen'
import EinvoiceStatusScreen from '../screens/EinvoiceStatusScreen'
import EinvoiceEditScreen from '../screens/EinvoiceEditScreen'
import NewOffer from '../screens/NewOffer'
import EditOffer from '../screens/EditOffer'
import ProductsOverviewforOffer from '../screens/ProductsOverviewforOffer'
import OrderDisplayScreen from "../screens/OrderDisplayScreen";
import ResetClientPassword from "../screens/ResetClientPassword";
import SpiltBillScreen from "../screens/SpiltBillScreen";
import SplitBillByHeadScreen from "../screens/SplitBillByHeadScreen";
import SubscriptionScreen from '../screens/SubscriptionScreen'
import RostersFormScreen from '../screens/RostersFormScreen'
import CalendarScreen from '../screens/CalendarScreen'
import MemberScreen from '../screens/MemberScreen'
import MemberFormScreen from '../screens/MemberFormScreen'
import RetailOrderForm from '../screens/RetailOrderForm'
import RetailCheckoutComplete from '../screens/RetailCheckoutComplete'
import InventoryScreen from '../screens/InventoryScreen'
import InventoryOrderScreen from '../screens/InventoryOrderScreen'
import InventoryOrderFormScreen from '../screens/InventoryOrderFormScreen'
import ReservationCalendarScreen from '../screens/ReservationCalendarScreen'
import ReservationScreen from '../screens/ReservationScreen'
import ReservationEditScreen from '../screens/ReservationEditScreen'
import ReservationFormScreen from '../screens/ReservationFormScreen'
import ReservationConfirmScreen from '../screens/ReservationConfirmScreen'
import ReservationViewScreen from '../screens/ReservationViewScreen'
import ReservationSetting from '../screens/ReservationSetting'
import {LocaleContext} from '../locales/LocaleContext'
import ReservationUpcomingScreen from '../screens/ReservationUpcomingScreen'


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {

  return (
    <Stack.Navigator
      initialRouteName="LoginSuccess"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="ClockIn" component={ClockIn} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} />
      <Stack.Screen name="RetailOrderStart" component={OrderStart} />
      <Stack.Screen name="RetailOrderForm" component={RetailOrderForm} />
      <Stack.Screen name="RetailOrderFormIII" component={OrderFormIII} />
      <Stack.Screen name="RetailPayment" component={Payment} />
      <Stack.Screen name="RetailCheckoutComplete" component={RetailCheckoutComplete} />
      <Stack.Screen name="RetailOrdersSummary" component={OrdersSummary} />
      <Stack.Screen name="RetailPaymentOrder" component={PaymentOrder} />
      <Stack.Screen name="Reservations" component={ReservationDrawer} options={{animationEnabled: false}} />
    </Stack.Navigator>
  );
}

const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingScr"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="SettingScr" component={SettingsScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Store" component={Store} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
      <Stack.Screen name="ProductsOverview" component={ProductsOverview} />
      <Stack.Screen name="Staff" component={Staff} />
      <Stack.Screen name="StaffsOverview" component={StaffsOverview} />
      <Stack.Screen name="StaffEdit" component={StaffEditScreen} />
      <Stack.Screen name="OptionScreen" component={OptionFormScreen} />
      <Stack.Screen name="Option" component={Option} />
      <Stack.Screen name="OptionEdit" component={OptionEdit} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="CategoryCustomize" component={CategoryCustomize} />
      <Stack.Screen name="PrinternKDS" component={PrinternKDS} />
      <Stack.Screen name="PrinterAdd" component={PrinterAdd} />
      <Stack.Screen name="PrinterEdit" component={PrinterEdit} />
      <Stack.Screen name="WorkingAreaAdd" component={WorkingAreaAdd} />
      <Stack.Screen name="WorkingAreaEdit" component={WorkingAreaEdit} />
      <Stack.Screen name="ShiftClose" component={ShiftClose} />
      <Stack.Screen name="TableLayouts" component={TableLayouts} />
      <Stack.Screen name="TableLayoutAdd" component={TableLayoutAdd} />
      <Stack.Screen name="TableLayoutEdit" component={TableLayoutEdit} />
      <Stack.Screen name="TableAdd" component={TableAdd} />
      <Stack.Screen name="TableEdit" component={TableEdit} />
      <Stack.Screen name="Announcements" component={Announcements} />
      <Stack.Screen name="AnnouncementsAdd" component={AnnouncementsAdd} />
      <Stack.Screen name="AnnouncementsEdit" component={AnnouncementsEdit} />
      <Stack.Screen name="CloseComplete" component={CloseComplete} />
      <Stack.Screen name="AccountClose" component={AccountClose} />
      <Stack.Screen name="AccountCloseConfirm" component={AccountCloseConfirm} />
      <Stack.Screen name="ManageVisualScreen" component={ManageVisualScreen} />
      <Stack.Screen name="EditUserRole" component={EditUserRole} />
      <Stack.Screen name="NewUserRole" component={NewUserRole} />
      <Stack.Screen name="ManageUserRole" component={ManageUserRole} />
      <Stack.Screen name="ManageOffers" component={ManageOffers} />
      <Stack.Screen name="EinvoiceSettingScreen" component={EinvoiceSettingScreen} />
      <Stack.Screen name="EinvoiceStatusScreen" component={EinvoiceStatusScreen} />
      <Stack.Screen name="EinvoiceEditScreen" component={EinvoiceEditScreen} />
      <Stack.Screen name="NewOffer" component={NewOffer} />
      <Stack.Screen name="EditOffer" component={EditOffer} />
      <Stack.Screen name="ProductsOverviewforOffer" component={ProductsOverviewforOffer} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen name="MemberScreen" component={MemberScreen} />
      <Stack.Screen name="MemberFormScreen" component={MemberFormScreen} />
    </Stack.Navigator>
  );
}

const TablesStack = () => {

  return (
    <Stack.Navigator
      initialRouteName="TablesScr"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="TablesScr" component={TablesScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="OrderDisplayScreen" component={OrderDisplayScreen} />
      <Stack.Screen name="OrderStart" component={OrderStart} />
      <Stack.Screen name="NewOrderForm" component={OrderForm} />
      <Stack.Screen name="OrderFormII" component={OrderFormII} />
      <Stack.Screen name="OrderFormIII" component={OrderFormIII} />
      <Stack.Screen name="OrderFormIV" component={OrderFormIV} />
      <Stack.Screen name="OrdersSummary" component={OrdersSummary} />
      <Stack.Screen name="UpdateOrder" component={UpdateOrder} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="PaymentOrder" component={PaymentOrder} />
      <Stack.Screen name="CheckoutComplete" component={CheckoutComplete} />
      <Stack.Screen name="SpiltBillScreen" component={SpiltBillScreen} />
      <Stack.Screen name="SplitBillByHeadScreen" component={SplitBillByHeadScreen} />
    </Stack.Navigator>
  );
}

const OrdersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OrdersScr"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="OrdersScr" component={OrdersScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="UpdateOrderFromOrderDetail" component={UpdateOrder} />
      <Stack.Screen name="NewOrderForm" component={OrderForm} />
    </Stack.Navigator>
  );
}
const ReportsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Reports"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Reports" component={ReportsScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="SalesCharts" component={SalesCharts} />
      <Stack.Screen name="StaffTimeCard" component={StaffTimeCard} />
      <Stack.Screen name="UserTimeCards" component={UserTimeCards} />
      <Stack.Screen name="CustomerStats" component={CustomerStats} />
      <Stack.Screen name="ShiftHistory" component={ShiftHistory} />
      <Stack.Screen name="ShiftDetails" component={ShiftDetails} />
    </Stack.Navigator>
  );
}
const InventoryStack = () => {

  return (
    <Stack.Navigator
      initialRouteName="InventoryScreen"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="InventoryScreen" component={InventoryScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="InventoryOrderScreen" component={InventoryOrderScreen} />
      <Stack.Screen name="InventoryOrderFormScreen" component={InventoryOrderFormScreen} />
    </Stack.Navigator>
  );
}
const RostersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CalendarScreen"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={({route: {params}}) => ({
        animationEnabled: params?.withAnimation ? false : true
      })} />
      <Stack.Screen name="RostersFormScreen" component={RostersFormScreen} />
    </Stack.Navigator>
  );
}

const ReservationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReservationCalendarScreen"
      headerMode="screen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="ReservationCalendarScreen" component={ReservationCalendarScreen} options={{
        title: null,
      }} />
      <Stack.Screen name="ReservationSetting" component={ReservationSetting} options={{
        title: null,
      }} />
      <Stack.Screen name="ReservationScreen" component={ReservationScreen} options={{
        title: null,
      }} />
      <Stack.Screen name="ReservationViewScreen" component={ReservationViewScreen} options={{
        title: null,
      }} />
      <Stack.Screen name="ReservationEditScreen" component={ReservationEditScreen} options={{
        title: null,
      }} />
      <Stack.Screen name="ReservationFormScreen" component={ReservationFormScreen} options={{
        title: null,
      }} />
      <Stack.Screen name="ReservationConfirmScreen" component={ReservationConfirmScreen} options={{
        title: null,
      }} />
    </Stack.Navigator>
  )
}
const LabelIcon = (props) => {

  const {focused, color, name} = props
  return (
    <View style={{paddingTop: 16, paddingBottom: 8, justifyContent: 'center'}}>
      <Icon name={name} size={30} focused={focused} color={color} />
    </View>
  )
}
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {props.state.routes.map((route, i) => {
        const focused = i === props.state.index;
        const {drawerIcon, drawerLabel} = props.descriptors[route.key].options;

        return (
          <DrawerItem
            key={route.key}
            label={({focused, color}) => {
              return (
                <View style={{width: 64, justifyContent: 'center', marginLeft: -2}}>
                  {drawerIcon({focused, color})}
                  <Text style={[{maxWidth: 44, color: '#fff', fontSize: 8, textAlign: 'center', marginLeft: -6}]}>
                    {drawerLabel}
                  </Text>
                </View>
              )
            }}
            activeTintColor={props.activeTintColor}
            inactiveTintColor={props.inactiveTintColor}
            activeBackgroundColor={props.activeBackgroundColor}
            focused={focused}
            onPress={() => {
              if (route.name == 'ReservationCalendar') {
                props.navigation.navigate('ReservationCalendar', {screen: 'ReservationCalendarScreen'})
              } else if (route.name == 'ReservationExit') {
                props.navigation.navigate('Home', {screen: 'LoginSuccess'})
              } else {
                props.navigation.navigate(route.name)
              }
            }}
          />
        );
      })}

    </DrawerContentScrollView>
  );
}
const ReservationDrawer = () => {
  const screenProps = React.useContext(LocaleContext);
  const dimensions = useWindowDimensions();
  const isTablet = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      initialRouteName="ReservationCalendarScreen"
      drawerContentOptions={{
        activeTintColor: '#488bd4',
        inactiveTintColor: '#f18d1a',
        activeBackgroundColor: '#222',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      openByDefault={isTablet ? true : false}
      edgeWidth={200}
      drawerStyle={isTablet ? {
        width: 64, backgroundColor: '#222', borderRightWidth: 0
      } : {width: 64, backgroundColor: '#222'}}
      drawerType={dimensions.width >= 768 ? 'permanent' : 'back'}
    >
      <Drawer.Screen name="ReservationUpcomingScreen" component={ReservationUpcomingScreen} options={{
        drawerLabel: screenProps.t('reservation.drawer.upcoming'),
        drawerIcon: ({focused, color}) => (
          <LabelIcon focused={focused} color={color} name='md-today' />
        )
      }} />
      <Drawer.Screen name="ReservationCalendar" component={ReservationStack} options={{
        drawerLabel: screenProps.t('reservation.drawer.calendar'),
        drawerIcon: ({focused, color}) => (
          <LabelIcon focused={focused} color={color} name='md-calendar-sharp' />
        )
      }} />
      <Drawer.Screen name="ReservationSetting" component={ReservationSetting} options={{
        drawerLabel: screenProps.t('reservation.drawer.settings'),
        drawerIcon: ({focused, color}) => (
          <LabelIcon focused={focused} color={color} name='md-settings' />
        )
      }} />
      <Drawer.Screen name="ReservationExit" component={HomeStack} options={{
        drawerLabel: screenProps.t('reservation.drawer.exit'),
        drawerIcon: ({focused, color}) => (
          <LabelIcon focused={focused} color={color} name='md-exit-outline' />
        )
      }} />


    </Drawer.Navigator >
  )
}


const BottomTab = () => {
  const screenProps = React.useContext(LocaleContext);
  const dimensions = useWindowDimensions();
  const isTablet = dimensions.width >= 768;

  const customHiddenRoutes = [
    'Payment', 'PaymentOrder', 'CheckoutComplete', 'SpiltBillScreen', 'SplitBillByHeadScreen', 'RetailPayment', 'RetailPaymentOrder', 'RetailCheckoutComplete', 'Reservations'
  ]

  const tabBarListeners = ({navigation, route}) => ({
    tabPress: async () => {
      const tokenObj = await getToken()
      if (tokenObj !== null && tokenObj.tokenExp > Date.now()) {
        if (route.name === 'CalendarScreen') {
          NavigationService?.navigateToRoute('Roster', {screen: 'CalendarScreen'}, null)
        } else if (!!route?.state?.routeNames) {
          navigation.navigate(route.state.routeNames[0], {withAnimation: false})
        } else {
          navigation.navigate(route.name, {withAnimation: false})
        }
      } else {
        handleRefreshToken()
      }
    }
  })


  return (
    <Tab.Navigator lazy={true}
      tabBarOptions={{
        labelPosition: 'below-icon',
        showLabel: false, showIcon: true,
      }}
      tabBar={props =>
        <BottomTabBar
          {...props}
          tabStyle={{
            height: 65,
            flex: 1,
            paddingTop: (isTablet ? 14 : 8),
            textAlign: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            color: screenProps?.customSecondThemeColor, backgroundColor: screenProps?.customTabBarBackgroundColor,
          }}
          showLabel={false}
          safeAreaInsets='bottom'
        />
      }
    >
      <Tab.Screen name="Home" component={HomeStack}
        options={({route}) => ({
          tabBarIcon: (props) => (<TabBarIcon focused={props?.focused} name={'md-home'} onPress={props?.onPress} />),
          tabBarVisible: !customHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))
        })}
        listeners={tabBarListeners}
      />
      {screenProps?.appType === 'store' && <Tab.Screen name="Tables" component={TablesStack} showLabel={false} options={({route}) => ({
        tabBarIcon: (props) => (<TabBarIcon focused={props?.focused} name="md-people" onPress={props?.onPress} />),
        tabBarVisible: !customHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))
      })}
        listeners={tabBarListeners} />}
      <Tab.Screen name="Orders" component={OrdersStack} showLabel={false} options={{
        tabBarIcon: (props) => (<TabBarIcon focused={props?.focused} name="md-document" onPress={props?.onPress} />)
      }} listeners={tabBarListeners} />
      <Tab.Screen name="Reports" component={ReportsStack} showLabel={false} options={{
        tabBarIcon: (props) => (<TabBarIcon focused={props?.focused} name={'ios-stats-chart'} onPress={props?.onPress} />)
      }} listeners={tabBarListeners} />
      {screenProps?.appType === 'retail' && <Tab.Screen name="Inventory" component={InventoryStack} showLabel={false} options={{
        tabBarIcon: (props) => (
          <TabBarIcon focused={props?.focused} name="inventory" onPress={props?.onPress} iconLib={'MaterialIcons'} />)
      }} listeners={tabBarListeners} />}
      <Tab.Screen name="Rosters" component={RostersStack} showLabel={false} options={{
        tabBarIcon: (props) => (<TabBarIcon focused={props?.focused} name="calendar-account"
          iconLib="MaterialCommunityIcons"
          onPress={() => NavigationService?.navigateToRoute('Rosters', {screen: 'CalendarScreen'}, props?.onPress)
          }
        />)
      }} listeners={tabBarListeners} />
      <Tab.Screen name="Settings" component={SettingsStack} showLabel={false} options={{
        tabBarIcon: (props) => (<TabBarIcon focused={props?.focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} onPress={props?.onPress} />)
      }} listeners={tabBarListeners} />
    </Tab.Navigator >
  );
}


function MainTabNavigator() {

  return (
    <Stack.Navigator headerMode="screen" initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>

      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{animationEnabled: false}} />
      <Stack.Screen name="Intro" component={IntroAppScreen} options={{animationEnabled: false}} />
      <Stack.Screen name="CreateAcc" component={CreateAccScreen} options={{animationEnabled: false}} />
      <Stack.Screen name="Login" component={Login} options={{animationEnabled: false}} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{animationEnabled: false}} />
      <Stack.Screen name="ResetClientPassword" component={ResetClientPassword} options={{animationEnabled: false}} />

      <Stack.Screen name="ClientUsers" component={ClientUsers} options={{animationEnabled: false}} />
      <Stack.Screen name="ClientUserLogin" component={ClientUserLogin} options={{animationEnabled: false}} />
      <Stack.Screen name="tabBar" component={BottomTab} options={{animationEnabled: false}} />

    </Stack.Navigator>
  )
}

export default MainTabNavigator
