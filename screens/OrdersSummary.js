import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { getOrder } from '../actions'
import OrdersSummaryRowOverView from './OrdersSummaryRowOverView'
import {NavigationEvents} from "react-navigation";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

class OrdersSummary extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getOrder()
  }

  render() {
    const {
      navigation,
      haveData,
      haveError,
      isLoading,
      order,
    } = this.props

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen/>
      )
    } else if (haveData) {
      return (
        <View>
          <NavigationEvents
            onWillFocus={() => {
              this.props.getOrder()
            }}
          />
          <OrdersSummaryRowOverView
            order={order}
            navigation={navigation}
            isLoading={isLoading}
            haveError={haveError}
            haveData={haveData}
          />
        </View>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading
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
  })(OrdersSummary)
)
