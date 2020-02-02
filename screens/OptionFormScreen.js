import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import BackBtn from '../components/BackBtn'
import InputText from '../components/InputText'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { isRequired } from '../validators'
import DeleteBtn from '../components/DeleteBtn'
import { LocaleContext } from '../locales/LocaleContext'

class OptionFormScreen extends React.Component {
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

  componentDidMount() {
    this.context.localize({
      en: {
        productOptionTitle: 'Product Option',
        optionName: 'Option Name',
        required: 'Required',
        multiple: 'Multiple',
        values: 'Option Values',
        value: 'Option Value',
        price: 'Option Price'
      },
      zh: {
        productOptionTitle: '產品選項',
        optionName: '選項名稱',
        required: '必填',
        multiple: '可複選',
        values: '選項列表',
        value: '選項值',
        price: '選項加價'
      }
    })
  }

  render() {
    const { t } = this.state
    const { handleSubmit, handleDeleteOption, initialValues } = this.props

    const renderOptionValPopup = (name, index, fields) => (
      <View
        style={[styles.paddingTopBtn20, styles.borderBottomLine]}
        key={index}
      >
        <View style={{ marginRight: 12 }}>
          <Icon
            name="minuscircleo"
            size={35}
            color="#f18d1a"
            onPress={() => fields.remove(index)}
          />
        </View>
        <View style={styles.grayBg}>
          <Field
            component={InputText}
            name={`${name}.value`}
            placeholder={t('value')}
          />
          <Field
            component={InputText}
            name={`${name}.price`}
            placeholder={t('price')}
            keyboardType={`numeric`}
            format={(value, name) => {
              return value !== undefined && value !== null ? String(value) : ''
            }}
          />
        </View>
      </View>
    )

    const renderOptionsValues = ({ label, fields }) => {
      return (
        <View>
          <View
            style={[
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine
            ]}
          >
            <Text>{label}</Text>
            <View style={{ position: 'absolute', right: 0, top: 8 }}>
              <IonIcon
                name="ios-add"
                size={35}
                color="#f18d1a"
                onPress={() => fields.push()}
              />
            </View>
          </View>
          {fields.map(renderOptionValPopup)}
        </View>
      )
    }

    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        <ScrollView scrollIndicatorInsets={{ right: 1 }}>
          <View style={[styles.container_nocenterCnt]}>
            <BackBtn />
            <Text
              style={[
                styles.maintitleText,
                styles.orange_color,
                styles.textBold
              ]}
            >
              {t('productOptionTitle')}
            </Text>

            <Field
              name="optionName"
              component={InputText}
              placeholder={t('optionName')}
              validate={isRequired}
            />

            <View
              style={[
                styles.flex_dir_row,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View style={[styles.onethirdWidth]}>
                <Text>{t('required')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field name="required" component={RNSwitch} />
              </View>
            </View>

            <View
              style={[
                styles.flex_dir_row,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View style={[styles.onethirdWidth]}>
                <Text>{t('multiple')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field name="multipleChoice" component={RNSwitch} />
              </View>
            </View>

            <FieldArray
              name="optionValues"
              component={renderOptionsValues}
              label={t('values')}
            />

            <View style={styles.bottom}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    this.props.navigation.state.params.customRoute
                  )
                }
              >
                <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
              {initialValues !== undefined && initialValues.id != null && (
                <DeleteBtn
                  handleDeleteAction={handleDeleteOption}
                  params={{ id: initialValues.id }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
OptionFormScreen = reduxForm({
  form: 'option_form'
})(OptionFormScreen)

export default OptionFormScreen
