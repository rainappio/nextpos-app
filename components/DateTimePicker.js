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
      needWeekFilter,
      ...rest
    } = this.props

    return (
    	<View style={{flex: 1}}>
    		<View style={[styles.flex_dir_row, styles.jc_alignIem_center]}>
    			{
    				needWeekFilter &&
    				<View style={{flex: 1, marginRight: 10, alignItems: 'flex-end'}}>
    					<Text onPress={() => onChange(moment(value).subtract(1, 'weeks').format('YYYY-MM-DD'))}>
    			    	<Icon name="ios-arrow-back" size={32} color="#f18d1a"/>
    			    </Text>
    			  </View>
    			}

          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', padding: 9, borderRadius: 4}}>
            <FontAwesomeIcon
              name="calendar"
              size={26}
              style={[styles.orange_color]}
            />
            <Text onPress={showDatepicker} style={{marginLeft: 5}}>
              {value}
            </Text>
          </View>

					{
    				needWeekFilter &&
        		<View style={{flex: 1, marginLeft: 10}}>
							<Text onPress={() => onChange(moment(value).add(1, 'weeks').format('YYYY-MM-DD'))}>
    						<Icon name="ios-arrow-forward" size={32} color="#f18d1a"/>
    					</Text>
    				</View>
    			}
    		</View>

      	{isShow && (
        	<RNDateTimePicker
          	testID="dateTimePicker"
          	timeZoneOffsetInMinutes={0}
          	value={new Date()}
          	mode={"date"}
          	is24Hour={true}
          	display="default"
          	onChange={(e, selectedDate) => {
          	  onChange(moment(e.nativeEvent.timestamp).format("YYYY-MM-DD"))
            }}
        	/>
      	)}
    	</View>
    )
  }
}
