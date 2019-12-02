import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, TouchableHighlight } from 'react-native'
import InputText from '../components/InputText'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import RNSwitch from '../components/RNSwitch'
import RenderRadioBtn from '../components/RadioItem'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'

class CategoryCustomizeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.screenProps.localize({
      en: {
        categoryTitle: 'Customize Category',
        options: 'Options',
        applyToProducts: 'Apply to Products',
        workingArea: 'Working Area'
      },
      zh: {
        categoryTitle: '修改產品分類',
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

    const { t } = this.props.screenProps

    return (
      // scroll bar in the center issue: https://github.com/facebook/react-native/issues/26610
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <View style={[styles.container_nocenterCnt]}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            {t('categoryTitle')}
          </Text>

          <View>
            <View style={styles.paddBottom_20}>
              <Field
                name="label"
                component={InputText}
                iscustomizeCate={true}
              />
            </View>

            <View
              style={[
                styles.borderBottomLine,
                styles.paddBottom_20,
                styles.minustopMargin10
              ]}
            >
              <Text style={styles.textBold}>{t('options')}</Text>
              <AddBtn
                onPress={() =>
                  this.props.navigation.navigate('Option', {
                    customRoute: this.props.navigation.state.routeName
                  })
                }
              />
            </View>

            <Field
              name="productOptionIds"
              component={RenderCheckboxGroup}
              customarr={prodctoptions}
              navigation={this.props.navigation}
              customRoute={'OptionEdit'}
            />

            <View
              style={[
                styles.jc_alignIem_center,
                styles.flex_dir_row,
                styles.paddingTopBtn20,
                styles.borderBottomLine
              ]}
            >
              <View>
                <Text style={styles.textBold}>{t('applyToProducts')}</Text>
              </View>
              <View style={[styles.onesixthWidth]}>
                <Field
                  name="appliesToProducts"
                  component={RNSwitch}
                  checked={true}
                />
              </View>
            </View>

            <View>
              <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
                <Text style={styles.textBold}>{t('workingArea')}</Text>
              </View>
              {workingareas !== undefined &&
                workingareas.map(workarea => (
                  <View
                    style={[styles.borderBottomLine, styles.paddingTopBtn20]}
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

            <View
              style={[
                {
                  width: '100%',
                  backgroundColor: '#F39F86',
                  borderRadius: 4,
                  marginBottom: 8
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
                  bottom: 0,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86'
                }
              ]}
            >
              <TouchableHighlight onPress={() => onCancel()}>
                <Text style={styles.signInText}>{t('action.cancel')}</Text>
              </TouchableHighlight>
            </View>
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
