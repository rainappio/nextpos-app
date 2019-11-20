import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import RNSwitch from '../components/RNSwitch'
import RenderRadioBtn from '../components/RadioItem'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import RenderRadioGroup from '../components/RadioGroup'
import styles from '../styles'

class CategoryCustomizeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const {
      labels,
      prodctoptions,
      workingareas,
      handleSubmit,
      onCancel
    } = this.props

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
            Customize Category
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
              <Text style={styles.textBold}>Option</Text>
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
                <Text style={styles.textBold}>Apply To Product</Text>
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
                <Text style={styles.textBold}>Working Area</Text>
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
                <Text style={styles.gsText}>Save</Text>
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
                <Text style={styles.signInText}>Cancel</Text>
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
