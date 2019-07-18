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
  TextInput,
  Button
} from 'react-native'
import { PropTypes } from 'prop-types'
import { isRequired, isEmail, isvalidPassword } from '../validators'
import validate from '../validate'
import InputText from '../components/InputText'
import styles from '../styles'

class CreateAccFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { handleSubmit, submitting } = this.props
    return (
      <View style={styles.childContainer}>
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

        <Text style={styles.welcomeText}>Let's Get Started</Text>

        <Field
          name="clientName"
          component={InputText}
          placeholder="Client Name"
          secureTextEntry={false}
        />

        <Field
          name="username"
          component={InputText}
          validate={isEmail}
          placeholder="Email Address"
          secureTextEntry={false}
        />

        <Field
          name="confirmusername"
          component={InputText}
          validate={isEmail}
          placeholder="Confirm Email Address"
          secureTextEntry={false}
        />

        <Field
          name="masterPassword"
          component={InputText}
          validate={isvalidPassword}
          placeholder="Password"
          secureTextEntry={true}
        />

        <Text style={styles.text}>
          Accept Seller Agreement and Privacy Policy
        </Text>
        <Text style={styles.textSmall}>
          View Seller Agreement and Privacy Policy
        </Text>

        <View
          style={[
            {
              width: '100%',
              backgroundColor: '#F39F86',
              position: 'absolute',
              bottom: 0,
              borderRadius: 4
            }
          ]}
        >
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.gsText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

CreateAccFormScreen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
}

CreateAccFormScreen = reduxForm({
  form: 'createAccForm',
  validate,
  asyncBlurFields: ['username', 'confirmusername', 'masterPassword']
})(CreateAccFormScreen)

export default CreateAccFormScreen
