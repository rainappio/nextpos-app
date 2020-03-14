import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
import { getfetchOrderInflights, getOrder } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

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
        backToTables: 'Back to Tables',
        completeOrder: 'Complete Order'
      },
      zh: {
        checkoutCompletedTitle: '結帳完成',
        totalAmount: '總金額',
        serviceCharge: '服務費',
        change: '找錢',
        backToTables: '回到桌位頁面',
        completeOrder: '結束訂單'
      }
    })
  }

  render() {
    const { t } = this.context
    const { transactionResponse } = this.props.navigation.state.params

    return (
      <View style={styles.container_nocenterCnt}>
        <ScreenHeader backNavigation={false}
                      title={t('checkoutCompletedTitle')}/>

        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={images.cash}
            style={{ width: 60, height: 60, marginBottom: 40 }}
          />
          <Text style={styles.centerText}>
            {t('totalAmount')}: ${transactionResponse.settleAmount}
          </Text>
          {transactionResponse.paymentMethod === 'CASH' && (
            <Text style={styles.centerText}>
              {t('change')}: ${transactionResponse.paymentDetails.values['CASH_CHANGE']}
            </Text>
          )}

        </View>

        <View style={styles.bottom}>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('TablesSrc')
                this.props.getfetchOrderInflights()
              }}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('backToTables')}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.state.params.onSubmit(
                  transactionResponse.orderId
                )
              }
            >
              <Text style={[styles.bottomActionButton, styles.secondActionButton]}>{t('completeOrder')}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
