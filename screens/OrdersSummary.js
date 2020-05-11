import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { getOrder } from '../actions'
import OrdersSummaryRowOverView from './OrdersSummaryRowOverView'
import {NavigationEvents} from "react-navigation";

class OrdersSummary extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {

  }

  render() {
    const {
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
          initialValues={initialValues}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
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
  })(OrdersSummary)
)
