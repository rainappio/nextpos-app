import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import InputText from '../components/InputText'
import RNSwitch from '../components/RNSwitch'
import styles, {mainThemeColor} from '../styles'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {isRequired} from '../validators'
import DeleteBtn from '../components/DeleteBtn'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import {WhiteSpace} from "@ant-design/react-native";

class OptionFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)
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
        productOptionTitle: '產品註記',
        optionName: '註記名稱',
        required: '必填',
        multiple: '可複選',
        values: '註記設定值',
        value: '註記值',
        price: '註記加價'
      }
    })
  }

  render() {
    const {t} = this.context
    const {handleSubmit, handleDeleteOption, initialValues} = this.props

    const renderOptionValPopup = (name, index, fields) => (
      <View
        style={[styles.tableRowContainerWithBorder]}
        key={index}
      >
        <View style={[{flex: 4}]}>
          <Field
            component={InputText}
            name={`${name}.value`}
            placeholder={t('value')}
            alignLeft={true}
          />
          <WhiteSpace/>
          <Field
            component={InputText}
            name={`${name}.price`}
            placeholder={t('price')}
            keyboardType={`numeric`}
            alignLeft={true}
            format={(value, name) => {
              return value !== undefined && value !== null ? String(value) : ''
            }}
          />
        </View>
        <View style={[{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}]}>
          <Icon
            name="minuscircleo"
            size={32}
            color={mainThemeColor}
            onPress={() => fields.remove(index)}
          />
        </View>

      </View>
    )

    const renderOptionsValues = ({label, fields}) => {
      return (
        <View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{label}</StyledText>

              <IonIcon
                name="md-add"
                size={32}
                color={mainThemeColor}
                onPress={() => fields.push()}
              />
            </View>
          </View>
          {fields.map(renderOptionValPopup)}
        </View>
      )
    }

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
                        title={t('productOptionTitle')}/>

          <View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Field
                  name="optionName"
                  component={InputText}
                  placeholder={t('optionName')}
                  validate={isRequired}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.fieldTitle}>{t('required')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <Field name="required" component={RNSwitch}/>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.fieldTitle}>{t('multiple')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <Field name="multipleChoice" component={RNSwitch}/>
              </View>
            </View>

            <FieldArray
              name="optionValues"
              component={renderOptionsValues}
              label={t('values')}
            />
          </View>

          <View style={[styles.bottom, styles.horizontalMargin]}>
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
                params={{id: initialValues.id}}
              />
            )}
          </View>
        </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

OptionFormScreen = reduxForm({
  form: 'option_form'
})(OptionFormScreen)

export default OptionFormScreen
