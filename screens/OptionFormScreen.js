import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
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
import Icon from 'react-native-vector-icons/AntDesign'
import BackBtn from '../components/BackBtn'
import OptionPopUp from '../components/OptionPopUp'
import InputText from '../components/InputText'
import RNSwitch from '../components/RNSwitch'
import styles from '../styles'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { isRequired } from '../validators'

class OptionFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { handleSubmit } = this.props

    const renderOptionValPopup = (name, index, fields) => (
      <View
        style={[styles.paddingTopBtn20, styles.borderBottomLine]}
        key={index}
      >
        <View style={{ marginRight: 12 }}>
          <Icon
            name="minuscircleo"
            size={35}
            color="#f18d1a"
            onPress={() => fields.remove(index)}
          />
        </View>
        <View style={styles.grayBg}>
          <Field
            component={InputText}
            name={`${name}.value`}
            placeholder="value"
          />

          <Field
            component={InputText}
            name={`${name}.price`}
            placeholder="price"
          />
        </View>
      </View>
    )

    const renderOptionsValues = ({ label, fields }) => {
      return (
        <View>
          <View
            style={[
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine
            ]}
          >
            <Text>{label}</Text>
            <View style={{ position: 'absolute', right: 0, top: 8 }}>
              <IonIcon
                name="ios-add"
                size={35}
                color="#f18d1a"
                onPress={() => fields.push()}
              />
            </View>
          </View>
          {fields.map(renderOptionValPopup)}
        </View>
      )
    }

    return (
      <ScrollView>
        <View style={[styles.container_nocenterCnt]}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold,
              styles.mgrbtn40
            ]}
          >
            Create Option
          </Text>

          <Field
            name="optionName"
            component={InputText}
            placeholder="Option Name"
            validate={isRequired}
          />

          <View
            style={[
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine
            ]}
          >
            <View style={[styles.onethirdWidth]}>
              <Text>Required</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field name="required" component={RNSwitch} />
            </View>
          </View>

          <View
            style={[
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine
            ]}
          >
            <View style={[styles.onethirdWidth]}>
              <Text>Multiple</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field name="optionType" component={RNSwitch} />
            </View>
          </View>

          <FieldArray
            name="optionValues"
            component={renderOptionsValues}
            label="Values"
          />

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
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate(
                  this.props.navigation.state.params.customRoute
                )
              }
            >
              <Text style={styles.signInText}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    )
  }
}
OptionFormScreen = reduxForm({
  form: 'option_form'
})(OptionFormScreen)

export default OptionFormScreen
