import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import InputText from '../components/InputText'
import {DismissKeyboard} from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'

class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <BackBtn/>
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
          <Text>
            Feature in development.
          </Text>
        </View>

      </ScrollView>
    )
  }
}

export default ReservationScreen
