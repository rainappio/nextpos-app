import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import BackBtn from '../components/BackBtn'
import styles from '../styles'

class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <View style={styles.container}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Reservation
          </Text>
          <Text>Feature in development.</Text>
        </View>
      </ScrollView>
    )
  }
}

export default ReservationScreen
