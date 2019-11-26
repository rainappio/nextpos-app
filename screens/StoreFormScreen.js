import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {ScrollView, Text, TouchableHighlight, View} from 'react-native'
import {isRequired} from '../validators'
import InputText from '../components/InputText'
import {DismissKeyboard} from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import RNSwitch from "../components/RNSwitch";

class StoreFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.props.screenProps.localize({
      en: {
        clientName: 'Client Name',
        clientEmail: 'Client Email',
        address: 'Address',
        ubn: 'UBN'
      },
      zh: {
        clientName: '商家名稱',
        clientEmail: '用戶 Email',
        address: '商家地址',
        ubn: '統一編號'
      }
    })
  }


  render() {
    const {t} = this.props.screenProps
    const {handleSubmit} = this.props

    return (
      <ScrollView scrollIndicatorInsets={{right: 1}}>
        <DismissKeyboard>
          <View style={styles.container_nocenterCnt}>
            <BackBtn/>
            <View>
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                {t('settings.stores')}
              </Text>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('clientName')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="clientName"
                  component={InputText}
                  validate={isRequired}
                  placeholder="Client Name"
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('clientEmail')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="username"
                  component={InputText}
                  validate={isRequired}
                  placeholder="User Email Address"
                  editable={false}
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('address')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="attributes.address"
                  component={InputText}
                  placeholder="Address"
                />
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
                <Text>{t('ubn')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="attributes.UBN"
                  component={InputText}
                  placeholder="UBN"
                />
              </View>
            </View>

            <View
              style={[
                {
                  width: '100%',
                  backgroundColor: '#F39F86',
                  marginBottom: 8,
                  borderRadius: 4
                }
              ]}
            >
              <TouchableHighlight onPress={handleSubmit}>
                <Text style={styles.gsText}>{t('action.save')}</Text>
              </TouchableHighlight>
            </View>
            <View
              style={[
                {
                  width: '100%',
                  // position: 'absolute',
                  // bottom: 0,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86'
                }
              ]}
            >
              <TouchableHighlight
                onPress={() => this.props.navigation.goBack()
                }
              >
                <Text style={styles.signInText}>{t('action.cancel')}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

StoreFormScreen = reduxForm({
  form: 'storeForm'
})(StoreFormScreen)

export default StoreFormScreen
