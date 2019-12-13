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
import { getTableLayouts, getTableLayout, clearTableLayout } from '../actions'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import TableLayoutForm from './TableLayoutForm'
import { api, makeFetchRequest, errorAlert } from '../constants/Backend'
import styles from '../styles'

class TableLayoutEdit extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  handleEditCancel = () => {
    this.props.clearTableLayout(this.props.navigation.state.params.layoutId)
    this.props.navigation.navigate('TableLayouts')
  }

  onOpenNP = tableId => {
    this.setState({
      tableId: tableId
    })
  }

  handleSubmit = values => {
    var id = values.id
    makeFetchRequest(token => {
      fetch(api.tablelayout.update + `${id}`, {
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
            this.props.navigation.navigate('TableLayouts')
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
    const {
      navigation,
      tablelayout,
      haveData,
      haveError,
      isLoading
    } = this.props
    const { t } = this.props.screenProps

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
                Edit Table Layouts
              </Text>
            </View>

            <View>
              <TableLayoutForm
                onSubmit={this.handleSubmit}
                t={t}
                initialValues={tablelayout}
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
  tablelayouts: state.tablelayouts.data.tableLayouts,
  tablelayout: state.tablelayout.data,
  haveData: state.tablelayout.haveData,
  haveError: state.tablelayout.haveError,
  isLoading: state.tablelayout.loading
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
  getTableLayout: id => dispatch(getTableLayout(id)),
  clearTableLayout: id => dispatch(clearTableLayout(id))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableLayoutEdit)
