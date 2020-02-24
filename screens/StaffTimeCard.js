import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import { getTimeCards } from '../actions'
import { api, dispatchFetchRequest, errorAlert, warningMessage } from '../constants/Backend'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import StaffTimeCardFilterForm from './StaffTimeCardFilterForm'

class StaffTimeCard extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  state = {
  	filteredTimeCard: []
  }

  componentDidMount() {
  	this.props.getTimeCards()
  }

  handleFilter = (values) => {
  	const month = values.month;
  	const year = values.year;

  	if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

    dispatchFetchRequest(api.timecard.getByMonthYr(year, month), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {}
    },
    response => {
      response.json().then(data => {
        this.setState({filteredTimeCard: data.userTimeCards})
      })
    }).then()
  }

  render() {
    const { t } = this.context
    const { timecards, haveData, haveError, loading } = this.props
    const { filteredTimeCard } = this.state

    Item = ({ timecard, layoutId, index }) => {
      const displayName = timecard.nickname != null ? timecard.nickname : timecard.id

      return (
      	<TouchableOpacity
					onPress={() => {
          	this.props.navigation.navigate('UserTimeCards', {
            	name: timecard.id,
              displayName: displayName
          	})
        	}}
      		>
        <View style={[{marginBottom: 10}]}>
          <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
            <View style={{flex: 5}}>
              <Text>{displayName}</Text>
            </View>

            <View style={{flex: 2}}>
              <Text style={{textAlign: 'center'}}>{timecard.totalShifts}</Text>
            </View>

            <View style={{flex: 3}}>
              <Text style={{textAlign: 'right'}}>{timecard.totalHours.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      )
    }

		if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
          	<BackBtn />
            <Text style={styles.screenTitle}>
             {t('title')}
            </Text>

          	<StaffTimeCardFilterForm
							onSubmit={this.handleFilter}
          	/>

						<View style={[styles.mgrtotop20]}>
            	<View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              	<View style={{flex: 5}}>
                	<Text style={[styles.orange_color, styles.textBold]}>{t('firstColTitle')}</Text>
              	</View>

              	<View style={{flex: 2.5, textAlign: 'center'}}>
                	<Text style={[styles.orange_color, styles.textBold]}>{t('secColTitle')}</Text>
              	</View>

              	<View style={{flex: 2.5}}>
                	<Text style={[{textAlign: 'right'}, styles.orange_color, styles.textBold]}>{t('thirdColTitle')}</Text>
              	</View>
            	</View>
            </View>

						<FlatList
              data={Object.keys(filteredTimeCard).length !== 0 ? filteredTimeCard : timecards}
              renderItem={({ item, index }) => (
                <Item timecard={item} layoutId={item.id} index={index}/>
              )}
              keyExtractor={item => item.id}
              //keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  timecards: state.timecards.data.userTimeCards,
  haveData: state.timecards.haveData,
  haveError: state.timecards.haveError,
  loading: state.timecards.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTimeCards: () => dispatch(getTimeCards())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffTimeCard)
