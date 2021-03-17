import React from "react";
import {LocaleContext} from "../locales/LocaleContext";
import {Text, TouchableOpacity, View, KeyboardAvoidingView, Animated} from "react-native";
import styles from "../styles";
import {Field, reduxForm} from "redux-form";
import InputText from "../components/InputText";
import {isEmail, isRequired, isvalidPassword} from "../validators";
import {ThemeContainer} from "../components/ThemeContainer";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {withNavigation} from "react-navigation";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer'

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
      resetPassword: null,
      canResendPasscode: false
    }
  }

  render() {
    const {showPasscodeField, showResetPasswordField, handleSubmit, handleVerifyPasscode, handleResetPassword} = this.props
    const {t, isTablet, customMainThemeColor} = this.context
    if (isTablet) {
      return (
        <ThemeContainer>
          <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScreenHeader
              backNavigation={false}
              title={t('resetPasswordTitle')}
            />

            <ThemeScrollView style={{paddingHorizontal: '15%'}}>
              {showResetPasswordField ?
                <View style={[styles.flex(1)]}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleContainer}>
                      <StyledText style={styles.sectionTitleText}>{t('greeting')}, {this.state?.clientEmail}</StyledText>
                    </View>
                  </View>


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

                    </View>
                  </View>

                </View>
                : showPasscodeField ?
                  <View style={[styles.flex(1)]}>
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionTitleContainer}>
                        <StyledText style={styles.sectionTitleText}>{t('greeting')}, {this.state?.clientEmail}</StyledText>
                      </View>
                    </View>




                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionTitleContainer}>
                        <StyledText style={styles.sectionTitleText}>{t('enterPasscode')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView]}>

                        <TouchableOpacity
                          style={[{
                            borderRadius: 4,
                            backgroundColor: customMainThemeColor,
                            alignItems: 'center',
                            height: '100%',
                            flexDirection: 'row',
                            paddingHorizontal: 12,
                            marginRight: 12
                          }]}
                          disabled={!this.state?.canResendPasscode}

                          onPress={() => {
                            this.setState({canResendPasscode: false}, handleSubmit)

                          }}
                        >
                          {this.state?.canResendPasscode || <CountdownCircleTimer
                            size={36}
                            strokeWidth={4}
                            isPlaying
                            duration={30}
                            onComplete={() => {
                              this.setState({canResendPasscode: true})
                            }}
                            colors={[
                              ['#004777', 0.4],
                              ['#8FFD01', 0.4],
                              ['#A30000', 0.2],
                            ]}
                          >
                            {({remainingTime, animatedColor}) => (
                              <Animated.Text style={{color: animatedColor}}>
                                {remainingTime}
                              </Animated.Text>
                            )}
                          </CountdownCircleTimer>}
                          <Text style={{color: '#fff', marginLeft: 6}}>{t('sendPasscodeAgain')}</Text>
                        </TouchableOpacity>
                        <Field
                          name="passcode"
                          component={InputText}
                          onChange={(value) => this.setState({passcode: value})}
                          autoCapitalize="none"
                          placeholder={t('passcode')}
                        />

                      </View>
                    </View>


                  </View>
                  : <View style={[styles.flex(1)]}>
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
                  </View>
              }

              <View style={{
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10,
                flexDirection: 'row',
                paddingHorizontal: '15%',
                height: 72
              }}>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Login')}
                  style={[styles?.flexButtonSecondAction(this.context), {marginRight: 5}]}
                >
                  <Text style={styles?.flexButtonSecondActionText(customMainThemeColor)}>
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showResetPasswordField ? () => handleResetPassword(this.state.clientEmail, this.state.resetPassword) : showPasscodeField ? () => handleVerifyPasscode(this.state.clientEmail, this.state.passcode) : handleSubmit} style={[styles?.flexButton(customMainThemeColor), {marginLeft: 5}]}>
                  <Text style={styles.flexButtonText}>
                    {showResetPasswordField ? t('changePassword') : showPasscodeField ? t('action.confirm') : t('action.submit')}
                  </Text>
                </TouchableOpacity>
              </View>

            </ThemeScrollView>
          </KeyboardAvoidingView>
        </ThemeContainer >
      )
    } else {
      return (
        <ThemeContainer>
          <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScreenHeader
              backNavigation={false}
              title={t('resetPasswordTitle')}
            />

            <ThemeScrollView >
              {showResetPasswordField ?
                <View style={[styles.flex(1)]}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleContainer}>
                      <StyledText style={styles.sectionTitleText}>{t('greeting')}, {this.state?.clientEmail}</StyledText>
                    </View>
                  </View>

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

                    </View>
                  </View>

                </View>
                : showPasscodeField ?
                  <View style={[styles.flex(1)]}>
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionTitleContainer}>
                        <StyledText style={styles.sectionTitleText}>{t('greeting')}, {this.state?.clientEmail}</StyledText>
                      </View>
                    </View>




                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionTitleContainer}>
                        <StyledText style={styles.sectionTitleText}>{t('enterPasscode')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView]}>

                        <TouchableOpacity
                          style={[{
                            borderRadius: 4,
                            backgroundColor: customMainThemeColor,
                            alignItems: 'center',
                            height: '100%',
                            flexDirection: 'row',
                            paddingHorizontal: 12,
                            marginRight: 12
                          }]}
                          disabled={!this.state?.canResendPasscode}

                          onPress={() => {
                            this.setState({canResendPasscode: false}, handleSubmit)

                          }}
                        >
                          {this.state?.canResendPasscode || <CountdownCircleTimer
                            size={36}
                            strokeWidth={4}
                            isPlaying
                            duration={30}
                            onComplete={() => {
                              this.setState({canResendPasscode: true})
                            }}
                            colors={[
                              ['#004777', 0.4],
                              ['#8FFD01', 0.4],
                              ['#A30000', 0.2],
                            ]}
                          >
                            {({remainingTime, animatedColor}) => (
                              <Animated.Text style={{color: animatedColor}}>
                                {remainingTime}
                              </Animated.Text>
                            )}
                          </CountdownCircleTimer>}
                          <Text style={{color: '#fff', marginLeft: 6}}>{t('sendPasscodeAgain')}</Text>
                        </TouchableOpacity>
                        <Field
                          name="passcode"
                          component={InputText}
                          onChange={(value) => this.setState({passcode: value})}
                          autoCapitalize="none"
                          placeholder={t('passcode')}
                        />

                      </View>
                    </View>


                  </View>
                  : <View style={[styles.flex(1)]}>
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
                  </View>
              }


              <View style={styles.bottom}>
                <TouchableOpacity
                  onPress={showResetPasswordField ? () => handleResetPassword(this.state.clientEmail, this.state.resetPassword) : showPasscodeField ? () => handleVerifyPasscode(this.state.clientEmail, this.state.passcode) : handleSubmit}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>{showResetPasswordField ? t('changePassword') : showPasscodeField ? t('action.confirm') : t('action.submit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Login')}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ThemeScrollView>
          </KeyboardAvoidingView>
        </ThemeContainer >
      )
    }

  }
}

ResetClientPasswordScreen = reduxForm({
  form: 'resetClientPasswordForm'
})(ResetClientPasswordScreen)

export default withNavigation(ResetClientPasswordScreen)
