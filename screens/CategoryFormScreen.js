import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { isTablet } from '../actions'

class CategoryFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
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
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={{ flex: 3 }}>
            <BackBtn size={isTablet ? 44 : 24}/>
            <Text
              style={styles.screenTitle}
            >
              {t('newCategoryTitle')}
            </Text>

            <Field
              name="label"
              component={InputText}
              validate={isRequired}
              placeholder={t('categoryName')}
              secureTextEntry={false}
            />
          </View>
      
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

      </DismissKeyboard>
    )
  }
}

CategoryFormScreen = reduxForm({
  form: 'categoryForm'
})(CategoryFormScreen)

export default CategoryFormScreen
