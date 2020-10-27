import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import InputText from '../components/InputText'
import AddBtn from '../components/AddBtn'
import RNSwitch from '../components/RNSwitch'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import RadioItemObjPick from "../components/RadioItemObjPick";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import DeleteBtn from '../components/DeleteBtn'

class CategoryCustomizeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.context.localize({
      en: {
        categoryTitle: 'Category',
        categoryName: 'Category Name',
        options: 'Options',
        applyToProducts: 'Apply to Products',
        workingArea: 'Working Area'
      },
      zh: {
        categoryTitle: '產品分類',
        categoryName: '類別名稱',
        options: '產品選項',
        applyToProducts: '套用設定到產品',
        workingArea: '工作區'
      }
    })
  }

  render() {
    const {
      labels,
      isEditForm,
      prodctoptions,
      workingareas,
      handleSubmit,
    } = this.props

    const {t} = this.context

    return (
      // scroll bar in the center issue: https://github.com/facebook/react-native/issues/26610
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
            title={t('categoryTitle')}

          />

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t('categoryName')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Field
                name="label"
                component={InputText}
                placeholder={t('categoryName')}
              />
            </View>
          </View>

          {isEditForm && (
            <View>
              <View style={styles.sectionContainer}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('options')}</StyledText>
                </View>

                <Field
                  name="productOptionIds"
                  component={RenderCheckboxGroup}
                  customarr={prodctoptions}
                  navigation={this.props.navigation}
                  customRoute={'OptionEdit'}
                />
              </View>

              <View style={styles.sectionContainer}>
                <View style={[styles.sectionTitleContainer]}>
                  <StyledText style={styles.sectionTitleText}>{t('workingArea')}</StyledText>
                </View>

                {workingareas !== undefined &&
                  workingareas.map(workarea => (
                    <View key={workarea.id}>
                      <Field
                        name='workingAreaId'
                        component={RadioItemObjPick}
                        customValueOrder={workarea.id}
                        optionName={workarea.name}
                        onCheck={(currentVal, fieldVal) => {
                          return fieldVal !== undefined && currentVal === fieldVal
                        }}
                      />
                    </View>
                  ))}
              </View>


              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText style={styles.fieldTitle}>{t('applyToProducts')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                  <Field
                    name="appliesToProducts"
                    component={RNSwitch}
                    checked={true}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={[styles.bottom, styles.horizontalMargin]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('ProductsOverview')
            }}>
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
            <DeleteBtn handleDeleteAction={() => this.props?.handleDelete()} />
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

CategoryCustomizeScreen = reduxForm({
  form: 'categorylist_searchform'
})(CategoryCustomizeScreen)
export default CategoryCustomizeScreen
