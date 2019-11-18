import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  Accordion,
  List,
  SwipeListView,
  SwipeRow,
  SwipeAction
} from '@ant-design/react-native'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import DropDown from '../components/DropDown'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick from '../components/RadioItemObjPick'
import { getProducts, getLables } from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import RenderStepper from '../components/RenderStepper'
import { isRequired } from '../validators'
import styles from '../styles'

class OrderFormIV extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { navigation, haveData, haveError, isLoading, product } = this.props

    return (
      <View style={styles.modalContainer}>
        <DismissKeyboard>
          <View
            style={[styles.boxShadow, styles.popUpLayout, styles.fullWidth]}
          >
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {this.props.navigation.state.params.prdItemName}
            </Text>
            <Text style={styles.textBold}>Option</Text>
            {product.productOptions !== undefined &&
              product.productOptions.map(prdOption => {
                var ArrForTrueState = []
                prdOption.optionValues.map((optVal, x) => {
                  ArrForTrueState.push({
                    optionName: prdOption.optionName,
                    optionValue: optVal.value,
                    optionPrice: optVal.price,
                    id: prdOption.versionId + x
                  })
                })

                return (
                  <View key={prdOption.versionId}>
                    <Text>{prdOption.optionName}</Text>
                    {prdOption.multipleChoice === false ? (
                      <View>
                        {prdOption.optionValues.map((optVal, ix) => {
                          let optionObj = {}
                          optionObj['optionName'] = prdOption.optionName
                          optionObj['optionValue'] = optVal.value
                          optionObj['optionPrice'] = optVal.price
                          optionObj['id'] = prdOption.id

                          return (
                            <View
                            	style={styles.paddingTopBtn20}
                              key={prdOption.id + ix}
                            >
                              <Field
                                name={prdOption.optionName}
                                component={RadioItemObjPick}
                                customValueOrder={
                                  optionObj !== undefined && optionObj
                                }
                                optionName={optVal.value}
                                validate={isRequired}
                              />
                            </View>
                          )
                        })}
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.borderBottomLine,
                          styles.paddBottom_20,
                          styles.minustopMargin10
                        ]}
                        key={prdOption.id}
                      >
                        <Text style={styles.textBold}>true</Text>

                        <Field
                          name={prdOption.optionName}
                          component={CheckBoxGroupObjPick}
                          //customarr={prdOption.optionValues}
                          customarr={ArrForTrueState}
                        />
                      </View>
                    )}
                  </View>
                )
              })}

            <View style={styles.paddingTopBtn20}>
              <Text style={styles.textBold}>Quantity</Text>
              <Field name="quantity" component={RenderStepper} />
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={{
                  width: '46%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86',
                  backgroundColor: '#F39F86',
                  marginRight: '2%'
                }}
              >
                <TouchableOpacity
                  //onPress={this.props.navigation.state.params.onSubmit}
                  onPress={this.props.handleSubmit}
                >
                  <Text style={[styles.signInText, styles.whiteColor]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '46%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86',
                  marginLeft: '2%'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('OrderFormII')
                  }}
                >
                  <Text style={styles.signInText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </View>
    )
  }
}

export default OrderFormIV = reduxForm({
  form: 'OrderFormIV'
})(OrderFormIV)
