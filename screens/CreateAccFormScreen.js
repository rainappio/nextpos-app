import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Image, Text, TouchableOpacity, View, Linking } from 'react-native'
import { PropTypes } from 'prop-types'
import { isEmail, isvalidPassword } from '../validators'
import validate from '../validate'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { withNavigation } from 'react-navigation'
import { LocaleContext } from '../locales/LocaleContext'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";

class CreateAccFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)
  }

  viewPrivacyPolicy = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  render() {
    const { handleSubmit } = this.props
    const { t } = this.context

    return (
      <ThemeContainer>
        <View style={styles.container}>
          <View style={styles.flex(1)}>
            <View>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              />
            </View>

            <StyledText style={styles.welcomeText}>Let's Get Started!</StyledText>

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

            <StyledText style={styles.text}>
              By signing up, you agree to the seller agreement and privacy policy.
            </StyledText>
            <TouchableOpacity onPress={() => this.viewPrivacyPolicy('http://rain-app.io')}>
            <StyledText style={styles.subText}>
              View Privacy Policy
            </StyledText>
            </TouchableOpacity>
          </View>

          <View style={[styles.bottom]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('signUp')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Intro')}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemeContainer>
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
