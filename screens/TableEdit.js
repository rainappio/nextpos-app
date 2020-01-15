import React from 'react'
import {connect} from 'react-redux'
import {
  AsyncStorage,
  View,
  Text,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import {Accordion, List, SwipeAction} from '@ant-design/react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  getTableLayout,
  clearTableLayout,
  getfetchOrderInflights
} from '../actions'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import {DismissKeyboard} from '../components/DismissKeyboard'
import TableForm from './TableForm'
import {api, makeFetchRequest, errorAlert} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'

class TableEdit extends React.Component {
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
    this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  handleSubmit = values => {
    var updateTbl = {}
    updateTbl.capacity = values.capacity
    updateTbl.coordinateX = values.xcoordinate
    updateTbl.coordinateY = values.ycoordinate
    updateTbl.tableName = values.tableName
    var tablelayoutId = this.props.navigation.state.params.layoutId
    var tableId = this.props.navigation.state.params.tableId
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/tablelayouts/${tablelayoutId}/tables/${tableId}`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('TableLayoutEdit', {
              layoutId: tablelayoutId
            })
            this.props.getTableLayout(tablelayoutId)
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
    const {t} = this.state

    if (isLoading || !haveData) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    }

    const choosenTbl = tablelayout.tables.find(
      table => table.tableId === this.props.navigation.state.params.tableId
    )

    return (
      <DismissKeyboard>
        <View style={[styles.container_nocenterCnt]}>
          <View>
            <BackBtn/>
            <Text style={styles.screenTitle}>
              {t('editTableTitle')}
            </Text>
          </View>
          <TableForm
            onSubmit={this.handleSubmit}
            initialValues={choosenTbl}
            isEdit={true}
            navigation={navigation}
          />
        </View>
      </DismissKeyboard>
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
  clearTableLayout: id => dispatch(clearTableLayout(id)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableEdit)
