import React from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {getOrder} from '../actions'
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import OrdersSummaryRow from "./OrdersSummaryRow";
import RetailOrderSummaryScreen from "./RetailOrderSummaryScreen";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {LocaleContext} from '../locales/LocaleContext'

class OrdersSummary extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.props.getOrder()
    this._getOrder = this.props.navigation.addListener('focus', () => {
      this.props.getOrder()
    })
  }
  componentWillUnmount() {
    this._getOrder()
  }

  render() {
    const {
      navigation,
      route,
      haveData,
      haveError,
      isLoading,
      order,
    } = this.props
    const {appType} = this.context

    if (haveError) {
      return (
        <BackendErrorScreen />
      )
    } else if (!!order?.orderId) {
      return (
        <ThemeScrollView>
          {appType === 'store' ? <OrdersSummaryRow
            order={order}
            navigation={navigation}
            route={route}
            initialValues={order}
          /> :
            <RetailOrderSummaryScreen
              order={order}
              navigation={navigation}
              route={route}
              initialValues={order}
            />
          }
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
  getOrder: () => dispatch(getOrder(props.route.params.orderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'ordersummaryForm'
  })(OrdersSummary)
)
