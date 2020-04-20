import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
  Dimensions,
  Platform
} from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import Icon from 'react-native-vector-icons/Ionicons'
import SortableList from '../components/SortableList'
import { getAnnouncements, getAnnouncement } from '../actions'
import {
  api,
  errorAlert,
  dispatchFetchRequest,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Markdown from 'react-native-markdown-display'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";

class Announcements extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  state = {
		scrollEnabled: true,
		refreshing: false
	}

  componentDidMount() {
    this.props.getAnnouncements()

    this.context.localize({
      en: {

      },
      zh: {

      }
    })
  }

  _adjuxtAutoScroll(bool) {
    this.setState({
    	scrollEnabled: bool
    })
  }

  _renderRow = ({ data, active }) => {
    return (
      <Row data={data} active={active} navigation={this.props.navigation} />
    )
  }

  handleItemOrderUpdate = (key, currentOrder, dataArr) => {
    for(var i=0;i<currentOrder.length;i++){
			if(''+i !== currentOrder[i]){
				dataArr[i].order = currentOrder[i];

				dispatchFetchRequest(
      		api.announcements.update(dataArr[i].id),
      		{
        		method: 'POST',
        		withCredentials: true,
        		credentials: 'include',
        		headers: {
          		'Content-Type': 'application/json'
        		},
        		body: JSON.stringify(dataArr[i])
      		},
      		response => {
        		//successMessage('Saved')
        		this.props.navigation.navigate('Announcements')
        		this.props.getAnnouncements()
      		}
    		).then()
			}
		}
  }

  if(isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    )
  }
  render() {
    const { navigation, getannouncements, isLoading, haveError } = this.props
     const { t } = this.context

    return (
      <View style={styles.stcontainer}>
      	<ScreenHeader title={t('settings.announcements')}
                      rightComponent={
                        <AddBtn
                          onPress={() =>
                            this.props.navigation.navigate('AnnouncementsAdd')
                          }
                        />
                      }
        />

        	{Object.keys(getannouncements).length !== 0 && (
          	<SortableList
          		style={styles.list}
             	data={getannouncements.results}
            	vertical={true}
            	renderRow={this._renderRow}
            	scrollEnabled={this.state.scrollEnabled}
            	onReleaseRow={(key, currentOrder, dataArr) =>
              	this.handleItemOrderUpdate(
                	key,
                	currentOrder,
                	getannouncements.results
              	)
            	}
            	onChangeOrder={() => this._adjuxtAutoScroll(true)}
          	/>
        	)}
    	</View>
    )
  }
}

const mapStateToProps = state => ({
  getannouncements: state.announcements.data,
  isLoading: state.announcements.loading,
  haveData: state.announcements.haveData,
  haveError: state.announcements.haveError
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getAnnouncements: () => dispatch(getAnnouncements()),
  getAnnouncement: id => dispatch(getAnnouncement(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Announcements)

class Row extends React.Component {
  constructor(props) {
    super(props)

    this._active = new Animated.Value(0)

    this._style = {
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1]
              })
            }
          ],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10]
          })
        },

        android: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07]
              })
            }
          ],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6]
          })
        }
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active)
      }).start()
    }
  }

  render() {
    const { data } = this.props

    return (
      <Animated.View style={[
        styles.row,
        this._style,
      ]}>
        <View key={data.id}>
          <View
            style={[styles.tableRowContainerWithBorder]}
          >
            <View style={[styles.tableCellView, { width: '10%' }]}>
              <IonIcon
                name={data.titleIcon}
                size={32}
                style={styles.buttonIconStyle}
              />
            </View>

            <View style={[styles.tableCellView, { width: '75%'}]}>
              <Text style={{ fontSize: 15 }}>{data.title}</Text>
            </View>

            <View style={[styles.tableCellView, { justifyContent: 'flex-end', width: '15%' }]}>
              <Icon
                name="md-create"
                size={24}
                style={styles.buttonIconStyle}
                onPress={() =>
                  this.props.navigation.navigate('AnnouncementsEdit', {
                    announcementId: data.id,
                    initialValues: data
                  })
                }
              />
            </View>
          </View>

          <View style={[{ padding: 10 }]}>
            <Markdown>
              {data.markdownContent}
            </Markdown>
          </View>
        </View>
      </Animated.View>
    )
  }
}
