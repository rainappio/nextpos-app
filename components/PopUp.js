import React, { Component } from 'react'
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'

export default class PopUp extends Component {
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
  	const { toRoute1, toRoute2, textForRoute1, textForRoute2, navigation, dataArr } = this.props
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
                      styles.mgrbtn40
                    ]}
                  >
                    Add
                  </Text>
                  <View
                    style={[styles.jc_alignIem_center, styles.flex_dir_row]}
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
                          navigation.navigate(toRoute1)
                          this.toggleModal(false)
                        }}
                      >
                        <Text style={[styles.signInText, styles.whiteColor]}>
                          { /*Category*/ }
                          {textForRoute1}
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
                          navigation.navigate(toRoute2,{
                          	dataArr: dataArr
                          })
                          this.toggleModal(false)
                        }}
                      >
                        <Text style={styles.signInText}>{textForRoute2}</Text>
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
