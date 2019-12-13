import React from 'react'
import { connect } from 'react-redux'
import {
  AsyncStorage,
  View,
  Text,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { getTableLayout, clearTableLayout } from '../actions'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import TableForm from './TableForm'
import { api, makeFetchRequest, errorAlert } from '../constants/Backend'
import styles from '../styles'

class TableEdit extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  handleEditCancel = () => {
    // this.props.clearTableLayout(this.props.navigation.state.params.layoutId)
    this.props.navigation.navigate('TableLayoutEdit')
  }

  handleSubmit = values => {
    var updateTbl = {}
    updateTbl.capacity = values.capacity
    updateTbl.coordinateX = values.xcoordinate
    updateTbl.coordinateY = values.ycoordinate
    updateTbl.tableName = values.tableName

    var tableId = this.props.navigation.state.params.tableId
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/tablelayouts/${tableId}/tables`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': token.application_client_id,
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('TableLayoutEdit')
            this.props.getTableLayout()
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const {
      navigation,
      tablelayout,
      haveData,
      haveError,
      isLoading
    } = this.props
    const { t } = this.props.screenProps
    var choosenTbl = tablelayout.tables.find(
      table => table.tableId === this.props.navigation.state.params.tableId
    )

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }
    return (
      <ScrollView>
        <DismissKeyboard>
          <View>
            <View style={[styles.container, styles.nomgrBottom]}>
              <BackBtn />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                {/* {t('settings.workingArea')}*/}
                Edit Table
              </Text>
              <TableForm
                onSubmit={this.handleSubmit}
                t={t}
                initialValues={choosenTbl}
                isEdit={true}
                navigation={navigation}
                handleEditCancel={this.handleEditCancel}
              />
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  tablelayout: state.tablelayout.data,
  haveData: state.tablelayout.haveData,
  haveError: state.tablelayout.haveError,
  isLoading: state.tablelayout.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayout: id => dispatch(getTableLayout(id)),
  clearTableLayout: id => dispatch(clearTableLayout(id))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableEdit)
