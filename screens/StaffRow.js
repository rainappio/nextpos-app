import React from 'react'
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
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import DropDown from '../components/DropDown'
import PopUp from '../components/PopUp'
// import { clearClient, getClientUsr, getClientUsrs } from '../actions'
import styles from '../styles'

class StaffRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  render() {
    const {
      clientusers = [],
      labels,
      navigation,
      haveData,
      haveError,
      isLoading
    } = this.props

    var clientusersOnly = clientusers.filter(function(el) {
      return el.defaultUser === false
    })

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
      >
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              Staffs List
            </Text>
            <AddBtn onPress={() => this.props.navigation.navigate('Staff')} />

            <View style={styles.standalone}>
              <SwipeListView
                data={clientusersOnly}
                renderItem={(data, rowMap) => (
                  <View style={styles.rowFront}>
                    <Text
                      key={rowMap}
                      style={{ paddingTop: 20, paddingBottom: 20 }}
                    >
                      {data.item.username}
                    </Text>
                  </View>
                )}
                keyExtractor={(data, rowMap) => rowMap.toString()}
                renderHiddenItem={(data, rowMap) => (
                  <View style={styles.rowBack} key={rowMap}>
                    <View style={styles.editIconII}>
                      <Icon
                        name="md-create"
                        size={25}
                        color="#fff"
                        onPress={() =>
                          this.props.navigation.navigate('StaffEdit', {
                            staffname: data.item.username
                          })
                        }
                      />
                    </View>
                  </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-80}
              />
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

// const mapDispatchToProps = dispatch => ({
//   dispatch,
//   getProducts: () => dispatch(getProducts())
// })

// export default connect(
//   null,
//   mapDispatchToProps
// )(StaffRow)
export default StaffRow
