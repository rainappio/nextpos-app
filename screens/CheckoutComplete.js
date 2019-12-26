import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
import { getfetchOrderInflights, getOrder } from '../actions'
import styles from '../styles'

class CheckoutComplete extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container_nocenterCnt}>
        <Text
          style={[
            styles.welcomeText,
            styles.orange_color,
            styles.textMedium,
            styles.textBold
          ]}
        >
          Checkout Completed
        </Text>

        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={images.cash}
            style={{ width: 60, height: 60, marginBottom: 40 }}
          />
          <Text style={styles.centerText}>
            Total Amount: $&nbsp;
            {this.props.navigation.state.params.discountTotal.toFixed(2)}
          </Text>
          <Text style={styles.centerText}>Service Charge: $&nbsp;0</Text>
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 4,
            backgroundColor: '#00ab66',
            marginTop: 8
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('TablesSrc')
              this.props.getfetchOrderInflights()
            }}
          >
            <Text style={[styles.signInText, styles.whiteColor]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#F39F86',
            marginTop: 8
          }}
        >
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.state.params.onSubmit(
                this.props.navigation.state.params.orderId
              )
            }
          >
            <Text style={styles.signInText}>Completed</Text>
          </TouchableOpacity>
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
