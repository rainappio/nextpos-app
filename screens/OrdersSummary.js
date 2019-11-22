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
import { getProducts, getLables, getOrder } from '../actions'
import OrdersSummaryRowOverView from './OrdersSummaryRowOverView'
import styles from '../styles'

class OrdersSummary extends React.Component {
  componentDidMount() {
    this.props.getOrder()
  }

  static navigationOptions = {
    header: null
  }

  constructor() {
    super(...arguments)
    this.state = {
      activeSections: [2, 0],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  render() {
    const {
      // products = [],
      // labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      order,
      initialValues
    } = this.props

    return (
      <View>
        {Object.keys(order).length !== 0 && (
          <OrdersSummaryRowOverView
            order={order}
            navigation={navigation}
            isLoading={isLoading}
            haveError={haveError}
            haveData={haveData}
            initialValues={initialValues}
          />
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  mee: state,
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading,
  initialValues: state.order.data
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'ordersummaryForm'
    //initialValues: {"name" : "shin"}
  })(OrdersSummary)
)
