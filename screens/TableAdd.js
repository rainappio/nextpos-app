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
import {api, makeFetchRequest, errorAlert, dispatchFetchRequest} from '../constants/Backend'
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
  }

  handleSubmit = values => {
    const layoutId = this.props.navigation.state.params.layoutId

    dispatchFetchRequest(api.tablelayout.createTable(layoutId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate('TableLayoutEdit')
      this.props.getTableLayout(layoutId)
      this.props.getTableLayouts()
    }).then()
  }

  render() {
    const { navigation } = this.props
    const { t } = this.context

    return (
      <View style={styles.fullWidthScreen}>
        <ScreenHeader title={t('addTableTitle')}
                      parentFullScreen={true}/>

        <TableForm onSubmit={this.handleSubmit} navigation={navigation}/>
      </View>
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
