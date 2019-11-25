import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'

class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView>
        <DismissKeyboard>
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
              Account
            </Text>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

export default AccountScreen
