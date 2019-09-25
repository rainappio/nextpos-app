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
  TextInput
} from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import styles from '../styles'

class CategoryFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { handleSubmit } = this.props
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
            Add Categories
          </Text>

          <Field
            name="label"
            component={InputText}
            validate={isRequired}
            placeholder="New Categories"
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
              <Text style={styles.gsText}>Save</Text>
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
              <Text style={styles.signInText}>Cancel</Text>
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
