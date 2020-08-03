import React from "react";
import {LocaleContext} from "../locales/LocaleContext";
import {Text, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import {Field, reduxForm} from "redux-form";
import InputText from "../components/InputText";
import {isEmail, isRequired, isvalidPassword} from "../validators";
import {ThemeContainer} from "../components/ThemeContainer";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {withNavigation} from "react-navigation";

class ResetClientPasswordScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props) {
    super(props)

    this.state = {
      clientEmail: null,
      passcode: null,
      resetPassword: null
    }
  }

  render() {
    const {showPasscodeField, showResetPasswordField, handleSubmit, handleVerifyPasscode, handleResetPassword} = this.props
    const {t} = this.context

    return (
      <ThemeContainer>
        <View style={[styles.container]}>
          <ScreenHeader
            backNavigation={false}
            title={t('resetPasswordTitle')}
          />

          <View style={[styles.flex(1)]}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('enterEmail')}</StyledText>
              </View>
            </View>

            <Field
              name="clientEmail"
              component={InputText}
              onChange={(value) => this.setState({clientEmail: value})}
              validate={[isRequired, isEmail]}
              autoCapitalize="none"
              placeholder={t('email')}
            />


            {showPasscodeField && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('enterPasscode')}</StyledText>
                </View>
                <View style={[styles.tableCellView, styles.withBorder]}>
                  <Field
                    name="passcode"
                    component={InputText}
                    validate={[isRequired]}
                    onChange={(value) => this.setState({passcode: value})}
                    autoCapitalize="none"
                    placeholder={t('passcode')}
                  />
                  <TouchableOpacity
                    onPress={() => handleVerifyPasscode(this.state.clientEmail, this.state.passcode)}>
                    <Text
                      style={[
                        styles.searchButton
                      ]}
                    >
                      {t('action.enter')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {showResetPasswordField && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('resetPassword')}</StyledText>
                </View>
                <View style={[styles.tableCellView]}>
                  <Field
                    name="resetPassword"
                    component={InputText}
                    validate={[isRequired, isvalidPassword]}
                    onChange={(value) => this.setState({resetPassword: value})}
                    placeholder={t('password')}
                    secureTextEntry={true}
                  />
                  <TouchableOpacity
                    onPress={() => handleResetPassword(this.state.clientEmail, this.state.resetPassword)}>
                    <Text
                      style={[
                        styles.searchButton
                      ]}
                    >
                      {t('action.enter')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.bottom}>
            <TouchableOpacity
              onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.ok')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
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

ResetClientPasswordScreen = reduxForm({
  form: 'resetClientPasswordForm'
})(ResetClientPasswordScreen)

export default withNavigation(ResetClientPasswordScreen)
