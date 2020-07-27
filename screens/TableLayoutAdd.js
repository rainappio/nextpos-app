import React from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import TableLayoutForm from './TableLayoutForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {getTableLayouts} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";

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
    const {navigation} = this.props
    const {t} = this.context

    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('addTableLayoutTitle')}
                        parentFullScreen={true}/>

          <TableLayoutForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
          />
        </View>
      </ThemeContainer>
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
