import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'

export default class RenderDatePicker extends Component {
  render(){
  	const {
      input: { onBlur, onChange, onFocus, value },
      placeholder,
      meta: { error, toched, vali5d },
      isShow,
      getWeekState,
      showDatepicker,
      getdate,
      ...rest
    } = this.props

		var currentDate = '';
    let promise = new Promise(function(resolve, reject) {
  		if (value) {
    		resolve(value)
  		}
  		else {
    		reject(Error("Promise err"));
  		}
		})

		promise.
    then((result) => {
      if(typeof(result) === 'string'){
				currentDate = new Date(result).toISOString()
			}else if(typeof(result) === 'object'){
				var date = result.hasOwnProperty('nativeEvent') && moment(result.nativeEvent.timestamp).format('YYYY-MM-DD')
				currentDate = new Date(date).toISOString()
			}
    }).
    catch((err) => {
      console.log(err);
    });

    return (
    	<View style={{flex: 1}}>
    		<View style={[styles.flex_dir_row, styles.jc_alignIem_center]}>
    			<View style={{flex: 1, marginRight: 10, alignItems: 'flex-end'}}>
						<Text onPress={() => onChange(moment(currentDate).isoWeekday(-6).format('YYYY-MM-DD'))}>
    					<Icon name="ios-arrow-back" size={32} color="#f18d1a"/>
    				</Text>
          </View>

          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', padding: 12}}>
            <FontAwesomeIcon
              name="calendar"
              size={26}
              style={[styles.orange_color]}
            />
            <Text onPress={showDatepicker} style={{padding: 5}}>
              {value.hasOwnProperty('nativeEvent') ? moment(value.nativeEvent.timestamp).format('YYYY-MM-DD') : value}
            </Text>
          </View>

        	<View style={{flex: 1, marginLeft: 10}}>
						<Text onPress={() => onChange(moment(currentDate).isoWeekday(+8).format('YYYY-MM-DD'))}>
    					<Icon name="ios-arrow-forward" size={32} color="#f18d1a"/>
    				</Text>
    			</View>
    		</View>

      	{isShow && (
        	<RNDateTimePicker
          	testID="dateTimePicker"
          	timeZoneOffsetInMinutes={0}
          	value={new Date()}
          	mode={"date"}
          	is24Hour={true}
          	display="default"
          	onChange={(e) => onChange(moment(e.nativeEvent.timestamp).format("YYYY-MM-DD"))}
        	/>
      	)}
    	</View>
    )
  }
}
