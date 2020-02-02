import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
import { getfetchOrderInflights, getOrder, isTablet } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class CheckoutComplete extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        checkoutCompletedTitle: 'Checkout Completed',
        totalAmount: 'Total Amount',
        serviceCharge: 'Service Charge',
        change: 'Change',
        done: 'Done',
        completeOrder: 'Complete Order'
      },
      zh: {
        checkoutCompletedTitle: '結帳完成',
        totalAmount: '總金額',
        serviceCharge: '服務費',
        change: '找錢',
        done: '結束',
        completeOrder: '結束訂單'
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const { t } = this.state
    const { transactionResponse } = this.props.navigation.state.params

    return (
      <View style={styles.container_nocenterCnt}>
        <Text style={styles.screenTitle}>
          {t('checkoutCompletedTitle')}
        </Text>

        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={images.cash}
            style={styles.cashImg}
          />
          <Text style={[styles.centerText, styles.defaultfontSize]}>
            {t('totalAmount')}: $&nbsp;
            {transactionResponse.settleAmount}
          </Text>
          <Text style={[styles.centerText, styles.defaultfontSize]}>
            {t('change')}: $&nbsp;{transactionResponse.cashChange}
          </Text>
        </View>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('TablesSrc')
              this.props.getfetchOrderInflights()
            }}
            style={styles.jc_alignIem_center}
          >
            <Text style={[styles.bottomActionButton, styles.cancelButton, styles.whiteColor, {borderRadius: 4,backgroundColor: '#00ab66', marginTop: 8, borderWidth: 0}]}>
              {t('done')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.state.params.onSubmit(
                transactionResponse.orderId
              )
            }
            style={styles.jc_alignIem_center}
          >
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('completeOrder')}</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  clearOrder: () => dispatch(clearOrder(props.order.orderId)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights())
})

export default connect(
  null,
  mapDispatchToProps
)(CheckoutComplete)
