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
import SegmentedControl from "../components/SegmentedControl";
import DropDown from "../components/DropDown";

class CreateAccFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);
    this.state = {
      operationStatus: [context.t('Preparing'), context.t('Opened')],
      operationStatusIndex: null,
      leadSource: [
        {label: context.t('leadSourceLabel.internetKeywords'), value: context.t('leadSourceLabel.internetKeywords')},
        {label: context.t('leadSourceLabel.socialMedia'), value: context.t('leadSourceLabel.socialMedia')},
        {label: context.t('leadSourceLabel.introductionByOthers'), value: context.t('leadSourceLabel.introductionByOthers')},
        {label: context.t('leadSourceLabel.others'), value: context.t('leadSourceLabel.others')},
      ],
      leadSourceSelected: null,
    }
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
    const {t, isTablet} = this.context

    return (
      <ThemeScrollView style={{flex: 1}}>
        <KeyboardAvoidingView style={styles.container} behavior="height">
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
          <View style={{...styles.flex(3), minHeight: 200, paddingHorizontal: isTablet ? '15%' : 0}}>

            <StyledText style={styles.welcomeText}>Let's Get Started!</StyledText>
            <View style={{paddingVertical: 5}}>
              <Field
                name="clientName"
                component={InputText}
                placeholder={t('clientName')}
                secureTextEntry={false}
                validate={isRequired}
              />
            </View>
            <View style={{paddingVertical: 5}}>
              <Field
                name="username"
                component={InputText}
                validate={[isRequired, isEmail]}
                placeholder={t('email')}
                secureTextEntry={false}
                autoCapitalize="none"
              />
            </View>
            <View style={{paddingVertical: 5}}>
              <Field
                name="masterPassword"
                component={InputText}
                validate={[isRequired, isvalidPassword]}
                placeholder={t('password')}
                secureTextEntry={true}
              />
            </View>
            <View style={{paddingVertical: 5}}>
              <Field
                name="confirmPassword"
                component={InputText}
                validate={[isRequired, isconfirmPassword]}
                placeholder={t('confirmPassword')}
                secureTextEntry={true}

              />
            </View>

            <StyledText style={[styles.text, {textAlign: 'center', }]}>
              {t('details')}
            </StyledText>
            <View style={{paddingVertical: 5}}>
              <Field
                name="ownerName"
                component={InputText}
                placeholder={t('ownerName')}
                secureTextEntry={false}
                validate={isRequired}
              />
            </View>
            <View style={{paddingVertical: 5}}>

              <Field
                name="contactNumber"
                component={InputText}
                validate={[isRequired]}
                placeholder={t('contactNumber')}
                secureTextEntry={false}
              />
            </View>
            <View style={{paddingVertical: 5}}>
              <Field
                name="contactAddress"
                component={InputText}
                validate={[isRequired]}
                placeholder={t('contactAddress')}
                secureTextEntry={false}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <StyledText style={{marginRight: 16}}>
                {t('operationStatus')}
              </StyledText>
              <View style={{flexDirection: 'column', flex: 1, maxWidth: 640, paddingVertical: 10, }}>
                <Field
                  name="operationStatus"
                  component={SegmentedControl}
                  selectedIndex={this.state.operationStatusIndex}
                  onChange={(index) => this.setState({operationStatusIndex: index})}
                  values={this.state.operationStatus}
                  validate={[isRequired]}
                />
              </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <StyledText style={{marginRight: 16}}>
                {t('leadSource')}
              </StyledText>
              <View style={{flexDirection: 'column', flex: 1, maxWidth: 640, paddingVertical: 10, }}>
                <Field
                  name="leadSource"
                  component={DropDown}
                  options={this.state.leadSource}
                  placeholder={{value: null, label: ``}}
                  onChange={(value) => {
                    this.setState({
                      leadSourceSelected: value
                    })
                  }}
                //validate={[(value, allValues, props, name) => console.log('allValues', allValues), isRequired]}
                />
              </View>
            </View>

            {this.state?.leadSourceSelected === t('leadSourceLabel.others') &&
              <View style={{paddingVertical: 5}}>
                <Field
                  name="leadSourceText"
                  component={InputText}
                  //validate={[isRequired]}
                  placeholder={t('leadSource')}
                  secureTextEntry={false}
                /></View>}

            <Field
              name="requirements"
              component={InputText}
              placeholder={t('requirements')}
              secureTextEntry={false}
            />
            <StyledText style={styles.text}>
              {t('privacyAgreement')}
            </StyledText>
            <TouchableOpacity onPress={() => this.viewPrivacyPolicy('https://www.rain-app.io/privacy')}>
              <StyledText style={styles.subText}>
                {t('viewPrivacy')}
              </StyledText>
            </TouchableOpacity>

          </View>

          {isTablet && <View style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
            paddingHorizontal: '25%',
            height: 72
          }}>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Intro')}
              style={[styles.flexButtonSecondAction, {marginRight: 5}]}
            >
              <Text style={styles.flexButtonSecondActionText}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.flexButton, , {marginLeft: 5}]}>
              <Text style={styles.flexButtonText}>
                {t('signUp')}
              </Text>
            </TouchableOpacity>
          </View>}

          {isTablet || <View style={[styles.bottom]}>
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
          </View>}
        </KeyboardAvoidingView>
      </ThemeScrollView>
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
