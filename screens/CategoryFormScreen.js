import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

class CategoryFormScreen extends React.Component {
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
        newCategoryTitle: 'New Category',
        categoryName: 'Category Name'
      },
      zh: {
        newCategoryTitle: '新增類別',
        categoryName: '類別名稱'
      }
    })
  }

  render() {
    const { handleSubmit } = this.props
    const { t, theme } = this.context

    return (
      <DismissKeyboard>
        <View style={[styles.container, theme]}>
          <View style={{ flex: 3 }}>
            <ScreenHeader title={t('newCategoryTitle')}/>

            <Field
              name="label"
              component={InputText}
              validate={isRequired}
              placeholder={t('categoryName')}
              secureTextEntry={false}
              theme={theme}
            />
          </View>
          <View stlye={styles.bottom}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ProductsOverview')}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </DismissKeyboard>
    )
  }
}

CategoryFormScreen = reduxForm({
  form: 'categoryForm'
})(CategoryFormScreen)

export default CategoryFormScreen
