import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import TableLayoutForm from './TableLayoutForm'
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage, dispatchFetchRequest
} from '../constants/Backend'
import { getTableLayouts } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

class TableLayoutAdd extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    // localization of this screen is put in TableLayoutForm to avoid overriding localeResource at the same time
    // and lose some translation.
  }

  handleSubmit = values => {
    dispatchFetchRequest(api.tablelayout.create, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate('TableLayouts')
      this.props.getTableLayouts()
    }).then()
  }

  render() {
    const { navigation } = this.props
    const { t } = this.context

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <ScreenHeader title={t('addTableLayoutTitle')}/>

          <TableLayoutForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
          />
        </View>
      </DismissKeyboard>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts())
})
export default connect(
  null,
  mapDispatchToProps
)(TableLayoutAdd)
