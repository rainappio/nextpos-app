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
  Platform,
  RefreshControl
} from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import Icon from 'react-native-vector-icons/Ionicons'
import SortableList from 'react-native-sortable-list'
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
	state = {
		scrollEnabled: true,
		refreshing: false
	}

  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext


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

  onRefresh = () => {
  	this.setState({
  		refreshing: true
  	})
  	this.props.getAnnouncements();
  	this.setState({
  		refreshing: false
  	})
  }

  _renderRow = ({ data, active }) => {
    return <Row data={data} active={active} navigation={this.props.navigation}/>
  }

  handleItemOrderUpdate = (key, currentOrder, dataArr) => {
  	// this.setState({
  	// 	refreshing: true
  	// })
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
        		// this.setState({
        		// 	refreshing: false
        		// })
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
      <View style={[styles.container_nocenterCnt, {paddingBottom: 40}]} 
      	refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            //onRefresh={this.handleItemOrderUpdate}
            onRefresh={this.onRefresh}
          />}
          >
      	<View>
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
             	data={getannouncements.results}             	  	
             	//data={data}
            	vertical={true}
            	style={styles.list}
            	renderRow={this._renderRow}
            	scrollEnabled={this.state.scrollEnabled}  
            	onReleaseRow={(key, currentOrder) => {
            		this._adjuxtAutoScroll(false)
								this.handleItemOrderUpdate(
              	  key,
              	  currentOrder,
              	  getannouncements.results
              	)
            	}}
            	onChangeOrder={() =>this._adjuxtAutoScroll(true)}
            	refreshControl={
          			<RefreshControl
              		refreshing={this.state.refreshing}
              		//onRefresh={this.handleItemOrderUpdate}
              		onRefresh={this.onRefresh}
            		/>
        			}
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
      ]}
      >

     <View
        style={[styles.flex_dir_row, { padding: '4%'}]}
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
            style={{ textAlign: 'right'}}
          />
        </View>
      </View>     

      <View style={styles.markDownStyle}>
        <Markdown>
          {data.markdownContent}
        </Markdown>
        <Text
          style={{
            textAlign: 'center',
            padding: '2%',
            fontSize: 15,                
          }}
        >
          Order&nbsp;{data.order}
        </Text>
      </View>
         
    </Animated.View>      
    )
  }
}
