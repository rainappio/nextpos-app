import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Text, View, TouchableOpacity } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import RadioItemObjPick from '../components/RadioItemObjPick'
import RenderStepper from '../components/RenderStepper'
import { isRequired, isCountZero } from '../validators'
import styles from '../styles'

class OrderFormIV extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { product } = this.props

    return (
      <View style={styles.modalContainer}>
        <DismissKeyboard>
          <View style={[styles.popUpLayout, styles.fullWidth]}>
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
            <Text style={[styles.textBold, styles.paddBottom_20]}>Option</Text>
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
                    <Text
                      style={{
                        backgroundColor: '#f1f1f1',
                        color: '#f18d1a',
                        padding: 8
                      }}
                    >
                      {prdOption.optionName}
                    </Text>
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
                              style={styles.paddingTopBtn8}
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
              <Field
                name="quantity"
                component={RenderStepper}
                validate={[isRequired, isCountZero]}
              />
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
