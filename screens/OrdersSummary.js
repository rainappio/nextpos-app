import React from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {getOrder} from '../actions'
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

    if (haveError) {
      return (
        <BackendErrorScreen />
      )
    } else if (!!order?.orderId) {
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
