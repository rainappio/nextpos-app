import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableHighlight } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

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
        <View style={styles.container_nocenterCnt}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold,
              styles.mgrbtn80
            ]}
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

          <View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                position: 'absolute',
                bottom: 48,
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
                position: 'absolute',
                bottom: 0,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }
            ]}
          >
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('ProductsOverview')}
            >
              <Text style={styles.signInText}>{t('action.cancel')}</Text>
            </TouchableHighlight>
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
