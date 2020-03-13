import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import InputText from '../components/InputText'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import RNSwitch from '../components/RNSwitch'
import RenderRadioBtn from '../components/RadioItem'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {DismissKeyboard} from "../components/DismissKeyboard";
import {NavigationEvents} from "react-navigation";

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
        categoryTitle: 'Customize Category',
        categoryName: 'Category Name',
        options: 'Options',
        applyToProducts: 'Apply to Products',
        workingArea: 'Working Area'
      },
      zh: {
        categoryTitle: '修改產品分類',
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
      prodctoptions,
      workingareas,
      handleSubmit,
      onCancel
    } = this.props

    const { t } = this.context

    return (
      // scroll bar in the center issue: https://github.com/facebook/react-native/issues/26610
      <ScrollView scrollIndicatorInsets={{right: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader parentFullScreen={true}
                        title={t('categoryTitle')}
                        rightComponent={
                          <AddBtn
                            onPress={() =>
                              this.props.navigation.navigate('Option', {
                                customRoute: this.props.navigation.state.routeName
                              })
                            }
                          />
                        }
          />

          <View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text style={styles.fieldTitle}>{t('categoryName')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
                <Field
                  name="label"
                  component={InputText}
                />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitleText}>{t('options')}</Text>
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
                <Text style={styles.sectionTitleText}>{t('workingArea')}</Text>
              </View>

              {workingareas !== undefined &&
              workingareas.map(workarea => (
                <View
                  style={[styles.optionsContainer]}
                  key={workarea.id}
                >
                  <Field
                    name="workingAreaId"
                    component={RenderRadioBtn}
                    customValue={workarea.id}
                    optionName={workarea.name}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <Text style={styles.fieldTitle}>{t('applyToProducts')}</Text>
            </View>
            <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>
              <Field
                name="appliesToProducts"
                component={RNSwitch}
                checked={true}
              />
            </View>
          </View>

          <View style={[styles.bottom, styles.horizontalMargin]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCancel()}>
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

CategoryCustomizeScreen = reduxForm({
  form: 'categorylist_searchform'
})(CategoryCustomizeScreen)
export default CategoryCustomizeScreen
