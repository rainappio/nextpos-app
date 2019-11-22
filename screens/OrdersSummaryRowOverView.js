import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  Accordion,
  List,
  SwipeListView,
  SwipeRow,
  SwipeAction
} from '@ant-design/react-native'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import {
  getProducts,
  getLables,
  getOrder,
  readableDateFormat
} from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import OrdersSummaryRow from './OrdersSummaryRow'
import styles from '../styles'

export const OrdersSummaryRowOverView = ({
  isLoading,
  haveError,
  haveData,
  order,
  navigation,
  onSubmit,
  initialValues,
  handleDelete
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    )
  } else if (haveError) {
    return (
      <View style={[styles.container]}>
        <Text>Err during loading, check internet conn...</Text>
      </View>
    )
  } else if (order !== undefined && order.length === 0) {
    return (
      <View style={[styles.container]}>
        <Text>no order ...</Text>
      </View>
    )
  }
  return (
    <OrdersSummaryRow
      order={order}
      navigation={navigation}
      initialValues={initialValues}
    />
  )
}

export default OrdersSummaryRowOverView
