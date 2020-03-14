import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import InputText from './InputText'
import { isRequired } from '../validators'
import styles from '../styles'

// todo: delete
export default class OptionPopUp extends Component {
  state = {
    isVisible: false
  }

  toggleModal = visible => {
    this.setState({
      isVisible: visible
    })
  }

  ismodalClose = msg => {
    console.log(msg)
  }

  render() {
    return (
      <View style={{ position: 'absolute', right: 0, top: -8 }}>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal(true)
          }}
        >
          <Icon name="ios-add" size={35} color="#f18d1a" />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => this.toggleModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContainer}
            onPressOut={() => {
              this.toggleModal(false)
            }}
          >
            <ScrollView
              directionalLockEnabled={true}
              contentContainerStyle={styles.modalContainer}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout]}
                >
                  <Text
                    style={[
                      styles.welcomeText,
                      styles.orange_color,
                      styles.mgrbtn20
                    ]}
                  >
                    Add
                  </Text>

                  <Field
                    name="masterPassword"
                    component={InputText}
                    validate={isRequired}
                    placeholder="Option Value"
                  />

                  <Field
                    name="masterPassword"
                    component={InputText}
                    validate={isRequired}
                    placeholder="Option Price"
                  />

                  <View
                    style={[
                      styles.jc_alignIem_center,
                      styles.flex_dir_row,
                      styles.paddTop_20
                    ]}
                  >
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
                        onPress={() => {
                          // this.props.navigation.navigate('Category')
                          this.toggleModal(false)
                        }}
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
                          // this.props.navigation.navigate('Product')
                          this.toggleModal(false)
                        }}
                      >
                        <Text style={styles.signInText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}
