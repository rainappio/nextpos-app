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
import Markdown from 'react-native-markdown-renderer'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

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
        		successMessage('Saved')
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
      	<View style={styles.fullWidth}>
        	<BackBtn />
        	<Text style={styles.screenTitle}>
            {t('settings.announcements')}
        	</Text>

        	<AddBtn
          	onPress={() =>
            	this.props.navigation.navigate('AnnouncementsAdd')
          	}
        	/>
      	</View>

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

  componentWillReceiveProps(nextProps) {
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
            style={[styles.flex_dir_row, { paddingTop: 4, marginBottom: 17 }]}
          >
            <View style={{ width: '45%' }}>
              <IonIcon
                name={data.titleIcon}
                size={28}
                color="#f18d1a"
              />
              <Text style={{ fontSize: 15 }}>{data.title}</Text>
            </View>

            <View style={[{ width: '55%' }]}>
              <Icon
                name="md-create"
                size={25}
                color="#f18d1a"
                onPress={() =>
                  this.props.navigation.navigate('AnnouncementsEdit', {
                    announcementId: data.id,
                    initialValues: data
                  })
                }
                style={{ textAlign: 'right' }}
              />
            </View>
          </View>

          <View
            style={[
              { backgroundColor: '#f1f1f1', padding: 20 },
              styles.mgrbtn20
            ]}
          >
            <Markdown style={styles.markDownStyle}>
              {data.markdownContent}
            </Markdown>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 15,
                marginBottom: -10
              }}
            >
              Order&nbsp;{data.order}
            </Text>
          </View>
        </View>
      </Animated.View>
    )
  }
}
