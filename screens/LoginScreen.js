import React from 'react'
import { Field, reduxForm } from 'redux-form'
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
import { PropTypes } from 'prop-types'
import { isRequired, isEmail } from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { handleSubmit } = this.props
    return (
      <View style={styles.container}>
        <View style={[{ position: 'absolute', top: 0 }]}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <Field
          name="username"
          component={InputText}
          validate={[isRequired, isEmail]}
          placeholder="Email Address"
        />

        <Field
          name="masterPassword"
          component={InputText}
          validate={isRequired}
          placeholder="Password"
          secureTextEntry={true}
        />

        <View
          style={[
            {
              width: '100%',
              backgroundColor: '#F39F86',
              marginTop: 40,
              borderRadius: 4
            }
          ]}
        >
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.gsText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

LoginScreen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
}

LoginScreen = reduxForm({
  form: 'loginForm'
})(LoginScreen)

export default LoginScreen
