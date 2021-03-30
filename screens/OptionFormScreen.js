import React, {useEffect} from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import InputText from '../components/InputText'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {isRequired} from '../validators'
import DeleteBtn from '../components/DeleteBtn'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import {WhiteSpace} from "@ant-design/react-native";
import {backAction} from '../helpers/backActions'
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

class OptionFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)

    this.state = {
      initialValuesCount: props?.initialValues?.optionValues?.length ?? 0
    }

  }



  componentDidMount() {
    this.context.localize({
      en: {
        productOptionTitle: 'Product Option',
        optionName: 'Option Name (e.g.: Sweetness)',
        required: 'Required',
        usedByProducts: 'Used by the following products',
        usedByProductLabels: 'Used by the following categorys',
        multiple: 'Multiple',
        values: 'Option Values',
        value: 'Option Value (e.g.: Less Sugar)',
        price: 'Option Price (e.g.: 0)'
      },
      zh: {
        productOptionTitle: '產品註記',
        optionName: '註記名稱 (如:甜度)',
        required: '必填',
        usedByProducts: '已被以下產品使用中',
        usedByProductLabels: '已被以下產品分類使用中',
        multiple: '可複選',
        values: '註記設定值',
        value: '註記值 (如:少糖)',
        price: '註記加價 (如:0)'
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  exchangeAnimate = (from, to, callback) => {
    Promise.all([
      this.[`renderOptionValRef_${from}`]?.pulse(500).then(endState => endState),
      this.[`renderOptionValRef_${to}`]?.pulse(500).then(endState => endState),]
    ).finally(() => {

    })
    callback()
  }

  deleteAnimate = (index, callback) => {
    this.[`renderOptionValRef_${index}`]?.fadeOutRight(250).then(() => {
      this.[`renderOptionValRef_${index}`]?.animate({0: {opacity: 1}, 1: {opacity: 1}}, 1)
      callback()
    })
  }

  render() {
    const {t, customMainThemeColor} = this.context
    const {handleSubmit, handleDeleteOption, initialValues} = this.props
    console.log('optionValues', initialValues?.optionValues)


    const renderOptionValPopup = (name, index, fields) => (
      <Animatable.View ref={(ref) => {
        this.[`renderOptionValRef_${index}`] = ref
      }}>
        <View
          style={[styles.tableRowContainerWithBorder]}
          key={index}
        >
          <View style={[{flex: 1, minWidth: 64, justifyContent: 'center', alignItems: 'center'}]}>
            <TouchableOpacity
              onPress={() => {
                if (index > 0) {
                  this.exchangeAnimate(index, index - 1, () => fields.swap(index, index - 1))
                }
              }}>
              <Ionicons
                name="caret-up-outline"
                size={32}
                color={index > 0 ? customMainThemeColor : 'gray'}

              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (index < fields.length - 1)
                  this.exchangeAnimate(index, index + 1, () => fields.swap(index, index + 1))

              }}>

              <Ionicons
                name="caret-down-outline"
                size={32}
                color={index < fields.length - 1 ? customMainThemeColor : 'gray'}

              />
            </TouchableOpacity>
          </View>
          <View style={[{flex: 27}]}>
            <Field
              component={InputText}
              name={`${name}.value`}
              placeholder={t('value')}
              alignLeft={true}
              validate={isRequired}
            />
            <WhiteSpace />
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
          <View style={[{flex: 2, minWidth: 64, justifyContent: 'center', alignItems: 'center'}]}>
            <Icon
              name="minuscircleo"
              size={32}
              color={fields.length > 1 ? customMainThemeColor : 'gray'}
              onPress={() => {
                if (fields.length > 1)
                  this.deleteAnimate(index, () => fields.remove(index))
              }}
            />
          </View>

        </View>
      </Animatable.View>
    )

    const renderOptionsValues = ({label, fields}) => {
      useEffect(() => {
        if (fields.length === 0 && this.state.initialValuesCount === 0)
          fields.push()
      }, []);
      return (
        <View>
          <View style={styles.sectionContainer}>
            <View style={[styles.sectionTitleContainer]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <StyledText style={styles.sectionTitleText}>{label}</StyledText>

                <IonIcon
                  name="md-add"
                  size={32}
                  color={customMainThemeColor}
                  onPress={() => {
                    this.scrollViewRef?.scrollToEnd({animated: true})
                    fields.push()
                  }}
                />
              </View>
            </View>
          </View>
          {fields.map(renderOptionValPopup)}
        </View>
      )
    }

    return (
      <ThemeKeyboardAwareScrollView getRef={(ref) => this.scrollViewRef = ref}>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
            backAction={() => backAction(this.props.navigation)}
            title={t('productOptionTitle')} />

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
                <Field name="required" component={RNSwitch} />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.fieldTitle}>{t('multiple')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <Field name="multipleChoice" component={RNSwitch} />
              </View>
            </View>

            <FieldArray
              name="optionValues"
              component={renderOptionsValues}
              label={t('values')}
            />
          </View>

          {initialValues !== undefined && initialValues?.usedByProducts != null && initialValues?.usedByProducts?.length > 0 && (
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.fieldTitle}>{t('usedByProducts')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end', flexWrap: 'wrap'}]}>
                {initialValues?.usedByProducts?.map((item, index, array) => {
                  return (
                    <StyledText style={styles.fieldTitle}>{item?.name}{(index < array?.length - 1) && ', '}</StyledText>
                  )
                })}
              </View>
            </View>
          )}
          {initialValues !== undefined && initialValues?.usedByProductLabels != null && initialValues?.usedByProductLabels?.length > 0 && (
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.fieldTitle}>{t('usedByProductLabels')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end', flexWrap: 'wrap'}]}>
                {initialValues?.usedByProductLabels?.map((item, index, array) => {
                  return (
                    <StyledText style={styles.fieldTitle}>{item?.name}{(index < array?.length - 1) && ', '}</StyledText>
                  )
                })}
              </View>
            </View>
          )}

          <View style={[styles.bottom, styles.horizontalMargin]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
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
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
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
