import React from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
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
            {this.props.navigation.state.params.payAmt.toFixed(2)}
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
            onPress={() => this.props.navigation.navigate('Tables')}
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
            onPress={() => this.props.navigation.navigate('Tables')}
          >
            <Text style={styles.signInText}>Back to Tables</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default CheckoutComplete
