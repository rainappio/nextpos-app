import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { getOrder } from '../actions'
import OrdersSummaryRowOverView from './OrdersSummaryRowOverView'
import {NavigationEvents} from "react-navigation";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import OrdersSummaryRow from "./OrdersSummaryRow";
import {ThemeScrollView} from "../components/ThemeScrollView";

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
        <ThemeScrollView>
          <NavigationEvents
            onWillFocus={() => {
              this.props.getOrder()
            }}
          />
          <OrdersSummaryRow
            order={order}
            navigation={navigation}
            initialValues={order}
          />
          {/*<OrdersSummaryRowOverView
            order={order}
            navigation={navigation}
            isLoading={isLoading}
            haveError={haveError}
            haveData={haveData}
          />*/}
        </ThemeScrollView>
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
