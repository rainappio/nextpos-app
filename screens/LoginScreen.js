import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {AsyncStorage, Image, Keyboard, Text, TouchableOpacity, View, Animated} from 'react-native'
import {Avatar} from 'react-native-elements'
import Modal from 'react-native-modal';
import {isEmail, isRequired} from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'
import {withNavigation} from 'react-navigation'
import {LocaleContext} from "../locales/LocaleContext";
import {storage} from "../constants/Backend";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import SegmentedControl from "../components/SegmentedControl";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {FontAwesome5} from '@expo/vector-icons';
import {SwipeListView} from 'react-native-swipe-list-view'
import DeleteBtn from '../components/DeleteBtn'


class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      fadeAnimation: new Animated.Value(1),
      showLoginBlock: true,
      selectedLoginMode: this.props?.loginMode ? 0 : 1,
      loginMode: this.props?.loginMode,
      loginDisplayTypes: {
        0: {label: context.t('account.loginWithAccount'), value: 'ACCOUNT'},
        1: {label: context.t('account.loginWithToken'), value: 'TOKEN'}
      },
      modalVisible: false,
      usedLoginUsers: [],
    }
  }

  fadeIn = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000
    }).start();
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 500
    }).start(() => {
      this.setState({showLoginBlock: false})
    });
  };

  handleLoginModeSelection = (index) => {
    this.setState({
      selectedLoginMode: index,
      loginMode: this.state.loginDisplayTypes[index].value
    })
  }

  componentDidMount() {
    this.context.localize({
      en: {
        loginTitle: 'Login',
        forgotPwd: 'Forgot Password',
        token: 'Staff Login Code',
        usedLoginAccounts: 'Recent Login Accounts',
      },
      zh: {
        loginTitle: '登入',
        forgotPwd: '忘記密碼',
        token: '員工登入碼',
        usedLoginAccounts: '常用登入帳戶',
      }
    })


    const removeLoginAs = this.props.navigation.getParam('removeLoginAs');

    if (removeLoginAs) {
      AsyncStorage.removeItem('usedLoginAccounts')
    }
    if (!removeLoginAs) {
      AsyncStorage.getItem('usedLoginAccounts').then(value => {
        this.setState({usedLoginUsers: JSON.parse(value)})
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.loginSuccess !== prevProps.loginSuccess) {
      this.fadeOut()
    }
  }

  handleDeleteAccountInfo = (item, index) => {
    let changedUsers = this.state.usedLoginUsers
    changedUsers.splice(index, 1)
    this.setState({usedLoginUsers: changedUsers})

    AsyncStorage.setItem('usedLoginAccounts', JSON.stringify(changedUsers))
  }

  Item = (item, rowMap) => {
    return (
      <View key={rowMap} style={[styles.tableRowContainerWithBorder, {paddingHorizontal: 20, backgroundColor: this?.context?.customBackgroundColor}]}>
        <TouchableOpacity style={[styles.tableCellView]}
          onPress={() => {
            this.props?.handleLoginUsedAccount(item.clientUsername, item.clientPassword)
          }}>
          <View style={[styles.tableCellView]}>
            <Avatar
              rounded
              title={item?.clientUsername.charAt(0).toUpperCase()}
              size="medium"
              overlayContainerStyle={[{backgroundColor: this?.context?.customMainThemeColor}]}
              titleStyle={styles.whiteColor}
            />
          </View>
          <View style={[styles.tableCellView, {paddingHorizontal: 16}]}>
            <StyledText style={styles.sectionBarText(this?.context?.customMainThemeColor)}>{item?.clientUsername}</StyledText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {handleSubmit, loginSuccess, loginMode} = this.props
    const {t, isTablet, customMainThemeColor} = this.context

    const loginTypes = Object.keys(this.state.loginDisplayTypes).map(key => this.state.loginDisplayTypes[key].label)



    if (isTablet) {
      return (
        <ThemeKeyboardAwareScrollView>
          <View style={[styles.container, {flexDirection: 'row'}]}>
            <Modal
              isVisible={this.state.modalVisible}
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              backdropOpacity={0.7}
              onBackdropPress={() => this.setState({modalVisible: false})}
              useNativeDriver
              hideModalContentWhileAnimating
              style={{
                margin: 40, flex: 1, justifyContent: 'flex-start'
              }}
            >
              <View style={[{minWidth: 600, marginTop: 100, flex: 1, alignSelf: 'center'}]}>
                <ThemeScrollView style={[{borderRadius: 8, padding: 0, flexDirection: 'row'}]}>
                  <View style={[styles.withBottomBorder, styles.jc_alignIem_center, {marginTop: 20, paddingVertical: 12, flexDirection: 'row'}]}>
                    <View style={{marginBottom: 10}}>
                      <FontAwesome5
                        name="history"
                        size={16}
                        style={[styles.buttonIconStyle(customMainThemeColor)]}
                      />
                    </View>
                    <View>
                      <StyledText style={[styles.screenSubTitle(customMainThemeColor)]}>
                        {t('usedLoginAccounts')}
                      </StyledText>
                    </View>
                  </View>
                  <View style={[styles.flex(1)]}>
                    <SwipeListView
                      data={this.state.usedLoginUsers}
                      renderItem={({item, rowMap}) => this.Item(item, rowMap)
                      }
                      ListEmptyComponent={() => {
                        return (
                          <StyledText style={[styles.messageBlock, styles.sectionContainer, styles.primaryText(customMainThemeColor)]}>{t('general.noData')}</StyledText>
                        )
                      }}
                      keyExtractor={(data, rowMap) => rowMap.toString()}
                      renderHiddenItem={(data, rowMap) => {
                        return (
                          <View style={[styles.flexRow, styles.flex(1), {justifyContent: 'flex-end'}]} key={rowMap}>
                            <View style={[styles.delIcon]}>
                              <DeleteBtn
                                handleDeleteAction={() =>
                                  this.handleDeleteAccountInfo(
                                    data.item,
                                    data.index
                                  )
                                }
                                islineItemDelete={true}
                              />
                            </View>
                          </View>
                        )
                      }}
                      rightOpenValue={-120}
                    />
                  </View>
                </ThemeScrollView>
              </View>
            </Modal>
            {this.state.showLoginBlock && <Animated.View style={{flex: 1, flexDirection: 'column', opacity: this.state.fadeAnimation}}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', }}>
                  <Image
                    source={
                      __DEV__
                        ? require('../assets/images/logo.png')
                        : require('../assets/images/logo.png')
                    }
                    style={styles.welcomeImage}
                  />
                  <View>
                    <TouchableOpacity
                      style={[styles.jc_alignIem_center, {borderRadius: 50, width: 40, height: 40, paddingVertical: 4}]}
                      onPress={() => this.setState({modalVisible: true})}>
                      <FontAwesome5
                        name="user-clock"
                        size={24}
                        style={[styles.buttonIconStyle(customMainThemeColor)]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <StyledText style={styles?.welcomeText(this.context)}>{t('loginTitle')}</StyledText>

                <View style={[styles.fieldContainer, styles.mgrbtn20]}>

                  <View style={{flex: 1}}>
                    <Field
                      name="loginMode"
                      component={SegmentedControl}
                      selectedIndex={this.state.selectedLoginMode}
                      onChange={this.handleLoginModeSelection}
                      values={loginTypes}
                      normalize={value => {
                        return this.state.loginDisplayTypes[value].value
                      }}
                    />
                  </View>
                </View>

                {this.state?.loginMode == 'ACCOUNT' && <View>
                  <View style={{marginBottom: 16}}>
                    <Field
                      name="username"
                      component={InputText}
                      validate={[isRequired, isEmail]}
                      placeholder={t('email')}
                      autoCapitalize="none"
                    />
                  </View>
                  <Field
                    name="masterPassword"
                    component={InputText}
                    validate={isRequired}
                    placeholder={t('password')}
                    secureTextEntry={true}
                  />
                </View>}
                {this.state?.loginMode == 'TOKEN' && <View>
                  <View>
                    <Field
                      name="token"
                      component={InputText}
                      validate={isRequired}
                      placeholder={t('token')}
                    />
                  </View>
                </View>
                }

              </View>

              <View style={styles.flex(1)}>

              </View>

              <View style={[styles.bottom]}>

                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss()
                    handleSubmit()
                  }}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                    {t('login')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Intro')}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('ResetClientPassword')
                }}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                    {t('forgotPwd')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>}
            <View style={{flex: 3, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <StyledText style={styles?.welcomeText(this.context)}>Simplify</StyledText>
                <StyledText style={styles?.welcomeText(this.context)}>Your</StyledText>
                <StyledText style={styles?.welcomeText(this.context)}>Selling</StyledText>
              </View>
            </View>
          </View>
        </ThemeKeyboardAwareScrollView>
      )
    }
    else {
      return (
        <ThemeKeyboardAwareScrollView>
          <View style={[styles.container]}>
            <Modal
              isVisible={this.state.modalVisible}
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              backdropOpacity={0.7}
              onBackdropPress={() => this.setState({modalVisible: false})}
              useNativeDriver
              hideModalContentWhileAnimating
              style={{
                margin: 40, flex: 1, justifyContent: 'flex-start'
              }}
            >
              <View style={[{minWidth: 320, marginTop: 100, flex: 1, alignSelf: 'center'}]}>
                <ThemeScrollView style={[{borderRadius: 8, padding: 0, flexDirection: 'row'}]}>
                  <View style={[styles.withBottomBorder, styles.jc_alignIem_center, {marginTop: 20, paddingVertical: 12, flexDirection: 'row'}]}>
                    <View style={{marginBottom: 10}}>
                      <FontAwesome5
                        name="history"
                        size={16}
                        style={[styles.buttonIconStyle(customMainThemeColor)]}
                      />
                    </View>
                    <View>
                      <StyledText style={[styles.screenSubTitle(customMainThemeColor)]}>
                        {`Used Login Account`}
                      </StyledText>
                    </View>
                  </View>
                  <View style={[styles.flex(1)]}>
                    <SwipeListView
                      data={this.state.usedLoginUsers}
                      renderItem={({item, rowMap}) => this.Item(item, rowMap)
                      }
                      ListEmptyComponent={() => {
                        return (
                          <StyledText style={[styles.messageBlock, styles.sectionContainerWithBorder, styles.primaryText(customMainThemeColor)]}>{t('general.noData')}</StyledText>
                        )
                      }}
                      keyExtractor={(data, rowMap) => rowMap.toString()}
                      renderHiddenItem={(data, rowMap) => {
                        return (
                          <View style={[styles.flexRow, styles.flex(1), {justifyContent: 'flex-end'}]} key={rowMap}>
                            <View style={[styles.delIcon]}>
                              <DeleteBtn
                                handleDeleteAction={() =>
                                  this.handleDeleteAccountInfo(
                                    data.item,
                                    data.index
                                  )
                                }
                                islineItemDelete={true}
                              />
                            </View>
                          </View>
                        )
                      }}
                      rightOpenValue={-120}
                    />
                  </View>
                </ThemeScrollView>
              </View>
            </Modal>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', }}>
                <Image
                  source={
                    __DEV__
                      ? require('../assets/images/logo.png')
                      : require('../assets/images/logo.png')
                  }
                  style={styles.welcomeImage}
                />
                <View>
                  <TouchableOpacity
                    style={[styles.jc_alignIem_center, {borderRadius: 50, width: 40, height: 40, paddingVertical: 4}]}
                    onPress={() => this.setState({modalVisible: true})}>
                    <FontAwesome5
                      name="user-clock"
                      size={24}
                      style={[styles.buttonIconStyle(customMainThemeColor)]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <StyledText style={styles?.welcomeText(this.context)}>{t('loginTitle')}</StyledText>

              <View style={[styles.fieldContainer, styles.mgrbtn20]}>

                <View style={{flex: 1}}>
                  <Field
                    name="loginMode"
                    component={SegmentedControl}
                    selectedIndex={this.state.selectedLoginMode}
                    onChange={this.handleLoginModeSelection}
                    values={loginTypes}
                    normalize={value => {
                      return this.state.loginDisplayTypes[value].value
                    }}
                  />
                </View>
              </View>

              {this.state?.loginMode == 'ACCOUNT' && <View>
                <View style={{marginBottom: 16}}>
                  <Field
                    name="username"
                    component={InputText}
                    validate={[isRequired, isEmail]}
                    placeholder={t('email')}
                    autoCapitalize="none"
                  />
                </View>
                <Field
                  name="masterPassword"
                  component={InputText}
                  validate={isRequired}
                  placeholder={t('password')}
                  secureTextEntry={true}
                />
              </View>}
              {this.state?.loginMode == 'TOKEN' && <View>
                <View>
                  <Field
                    name="token"
                    component={InputText}
                    validate={isRequired}
                    placeholder={t('token')}
                  />
                </View>
              </View>
              }

            </View>

            <View style={styles.flex(1)}>

            </View>

            <View style={[styles.bottom]}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss()
                  handleSubmit()
                }}
              >
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Intro')}
              >
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ResetClientPassword')
              }}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('forgotPwd')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeKeyboardAwareScrollView>
      )
    }
  }
}

LoginScreen = reduxForm({
  form: 'loginForm'
})(LoginScreen)

export default withNavigation(LoginScreen)
