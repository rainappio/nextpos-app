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
import { getTableLayout, getTableLayouts } from '../actions'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import TableForm from './TableForm'
import { api, makeFetchRequest, errorAlert } from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

class TableAdd extends React.Component {
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

  handleSubmit = values => {
    var layoutId = this.props.navigation.state.params.layoutId
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/tablelayouts/${layoutId}/tables`, {
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
            this.props.navigation.navigate('TableLayoutEdit')
            this.props.getTableLayout(layoutId)
            this.props.getTableLayouts()
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
    const { navigation, tablelayout } = this.props
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <ScreenHeader title={t('addTableTitle')}/>

          <TableForm onSubmit={this.handleSubmit} navigation={navigation} />
        </View>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
  tablelayout: state.tablelayout.data
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayout: id => dispatch(getTableLayout(id)),
  getTableLayouts: () => dispatch(getTableLayouts())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableAdd)
