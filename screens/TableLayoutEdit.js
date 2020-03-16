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
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage, dispatchFetchRequest
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import AddBtn from "../components/AddBtn";

class TableLayoutEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  handleEditCancel = () => {
    this.props.clearTableLayout(this.props.navigation.state.params.layoutId)
    this.props.navigation.navigate('TableLayouts')
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
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            successMessage('Saved')
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

  handleDeleteLayout = (layoutId) => {
    dispatchFetchRequest(api.tablelayout.delete(layoutId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {},
    }, response => {
      successMessage('Table layout deleted')
      this.props.navigation.navigate('TableLayouts')
    }).then()
  }

  render() {
    const {
      navigation,
      tablelayout,
      haveData,
      haveError,
      isLoading
    } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }
    return (
    	<ScrollView scrollIndicatorInsets={{ right: 1 }}>
      	<DismissKeyboard>
        	<View style={[styles.container_nocenterCnt]}>
            <ScreenHeader title={t('editTableLayoutTitle')}
                          rightComponent={
                            <AddBtn
                              onPress={() =>
                                this.props.navigation.navigate('TableAdd', {
                                  layoutId: tablelayout.id
                                })
                              }
                            />
                          }
            />

          	<TableLayoutForm
            	onSubmit={this.handleSubmit}
            	handleDeleteLayout={this.handleDeleteLayout}
            	initialValues={tablelayout}
            	isEdit={true}
            	navigation={navigation}
            	handleEditCancel={this.handleEditCancel}
          	/>
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
