import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { PropTypes } from 'prop-types'
import { isEmail, isvalidPassword } from '../validators'
import validate from '../validate'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import { isTablet } from '../actions'
import styles from '../styles'
import { withNavigation } from 'react-navigation'
import { LocaleContext } from '../locales/LocaleContext'

class CreateAccFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)

    this.state = {
      t: context.t
    }
  }

  render() {
    const { handleSubmit } = this.props
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={{ flex: 3, justifyContent: 'center' }}>
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

            <Text style={isTablet ? [styles.tabletTextBig, styles.centerText] : styles.defaultfontSize}>Let's Get Started!</Text>

            <Field
              name="clientName"
              component={InputText}
              placeholder={t('clientName')}
              secureTextEntry={false}
            />

            <Field
              name="username"
              component={InputText}
              validate={isEmail}
              placeholder={t('email')}
              secureTextEntry={false}
              autoCapitalize="none"
            />
            <Field
              name="masterPassword"
              component={InputText}
              validate={isvalidPassword}
              placeholder={t('password')}
              secureTextEntry={true}
            />

            <Text style={isTablet ? [styles.tabletTextMedium, styles.paddTop_30, styles.mgrbtn20] : styles.text}>
              Accept Seller Agreement and Privacy Policy
            </Text>
            <Text style={isTablet ? styles.textMedium : styles.defaultfontSize}>
              View Seller Agreement and Privacy Policy
            </Text>
          </View>

            <TouchableOpacity onPress={handleSubmit} style={styles.jc_alignIem_center}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('signUp')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Intro')}
              style={styles.jc_alignIem_center}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          
        </View>
      </DismissKeyboard>
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

export default withNavigation(CreateAccFormScreen)
