import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Image, Linking, Text, TouchableOpacity, View, KeyboardAvoidingView} from 'react-native'
import {PropTypes} from 'prop-types'
import {isEmail, isRequired, isvalidPassword, isconfirmPassword} from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'
import {withNavigation} from 'react-navigation'
import {LocaleContext} from '../locales/LocaleContext'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";

class CreateAccFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);
    //this.state = {pwd: ''};
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
    const {handleSubmit} = this.props
    const {t} = this.context

    return (
      <ThemeContainer>
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <ThemeScrollView style={{flex: 1}}>
            <View style={{...styles.flex(3), minHeight: 200}}>
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
                validate={isRequired}
              />

              <Field
                name="username"
                component={InputText}
                validate={[isRequired, isEmail]}
                placeholder={t('email')}
                secureTextEntry={false}
                autoCapitalize="none"
              />
              <Field
                name="masterPassword"
                component={InputText}
                validate={[isRequired, isvalidPassword]}
                placeholder={t('password')}
                secureTextEntry={true}
              />
              <Field
                name="confirmPassword"
                component={InputText}
                validate={[isRequired, isconfirmPassword]}
                placeholder={t('confirmPassword')}
                secureTextEntry={true}

              />



              <StyledText style={styles.text}>
                {t('privacyAgreement')}
              </StyledText>
              <TouchableOpacity onPress={() => this.viewPrivacyPolicy('http://rain-app.io')}>
                <StyledText style={styles.subText}>
                  {t('viewPrivacy')}
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
          </ThemeScrollView>
        </KeyboardAvoidingView>
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
  // validate,
  // asyncBlurFields: ['username', 'confirmusername', 'masterPassword']
})(CreateAccFormScreen)

export default withNavigation(CreateAccFormScreen)
