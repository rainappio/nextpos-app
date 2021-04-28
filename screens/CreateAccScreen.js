import React from 'react'
import CreateAccFormScreen from './CreateAccFormScreen'
import {api, successMessage, warningMessage} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'

class CreateAccScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    context.localize({
      en: {
        signUp: 'Sign Up',
        accountCreated: 'Your account is created',
        errorMessage: 'Email is already registered, please choose another email address.',
        privacyAgreement: 'By signing up, you agree to the Terms of Service and privacy policy.',
        viewPrivacy: 'View Privacy Policy',
        ownerName: 'Owner Name',
        contactNumber: 'Contact Number',
        contactAddress: 'Contact Address',
        operationStatus: 'Operation Status',
        leadSource: 'How did you hear about Rain App',
        requirements: 'requirements',
        Preparing: 'Preparing',
        Opened: 'Opened',
        leadSourceLabel: {
          internetKeywords: 'Internet keywords',
          socialMedia: 'Social media',
          introductionByOthers: 'Introduction by others',
          others: 'Others'
        },
        details: 'Details'
      },
      zh: {
        signUp: '註冊',
        accountCreated: '帳號註冊成功',
        errorMessage: '此email已經註冊過，請使用新的email來註冊。',
        privacyAgreement: '您創立新帳號的同時，亦等於同意我們的服務條款與隱私政策。',
        viewPrivacy: '參閱隱私政策',
        ownerName: '姓名',
        contactNumber: '電話',
        contactAddress: '公司/餐廳地址',
        operationStatus: '營運狀態',
        leadSource: '您如何得知Rain App',
        requirements: '需求說明',
        Preparing: '籌備中',
        Opened: '已開業',
        leadSourceLabel: {
          internetKeywords: '網路關鍵字',
          socialMedia: '社群媒體',
          introductionByOthers: '他人介紹',
          others: '其他'
        },
        details: '詳細資訊'
      }
    })
    this.state = {

    }
  }

  componentDidMount() {
    this.setState({
      operationStatus: [this.context.t('Preparing'), this.context.t('Opened')],
    })
  }

  handleSubmit = values => {
    const creatAccRequest = {
      clientName: values?.clientName,
      username: values?.username,
      masterPassword: values?.masterPassword,
      clientInfo: {
        ownerName: values?.ownerName,
        contactNumber: values?.contactNumber,
        contactAddress: values?.contactAddress,
        operationStatus: this.state?.operationStatus?.[values?.operationStatus],
        leadSource: values?.leadSource === this.context.t('leadSourceLabel.others') ? values?.leadSourceText : values?.leadSource,
        requirements: values?.requirements,
      }
    }


    fetch(api.client.new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creatAccRequest) // data can be `string` or {object}!
    })
      .then(response => {
        if (!response.ok) {
          warningMessage(this.context.t('errorMessage'))
        } else {
          successMessage(this.context.t('accountCreated'))
          this.props.navigation.navigate('Login')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    return (
      <CreateAccFormScreen
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export default CreateAccScreen
