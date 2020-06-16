import React, {Component} from 'react'
import {Text, View, TouchableOpacity, Modal} from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import {dateToLocaleString} from "../actions";
import {LocaleContext} from "../locales/LocaleContext";

export default class RenderDatePicker extends Component {
  static contextType = LocaleContext

  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      placeholder,
      meta: {error, toched, vali5d},
      isShow,
      showDatepicker,
      needWeekFilter,
      readonly,
      ...rest
    } = this.props
    const {t, locale} = this.context

    const i18nMoment = moment(value);

    if (locale === 'zh-Hant-TW') {
      i18nMoment.locale('zh-tw')
    } else {
      i18nMoment.locale('en')
    }

    const fontColor = readonly ? '#c5c5c5' : '#000000'

    return (
      <View style={{flex: 1}}>
        <View>
          <Modal transparent={true}
                 visible={isShow}
          >
            <View style={{flex: 1, backgroundColor: '#c5c5c5', justifyContent: 'center', alignContent: 'center'}}>
              <Text style={styles.screenTitle}>{t('datetimeRange.pickerTitle')}</Text>

              <RNDateTimePicker
                testID="dateTimePicker"
                value={value}
                mode={"datetime"}
                is24Hour={true}
                display="default"
                onChange={(e, selectedDate) => {
                  console.log(`on change date: ${selectedDate} ${e.nativeEvent.timestamp}`)

                  onChange(new Date(e.nativeEvent.timestamp))
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  showDatepicker();
                }}
              >
                <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('datetimeRange.select')}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <View style={{}}>
          <View style={[styles.flex_dir_row, styles.jc_alignIem_center]}>
            {/*{
    				needWeekFilter &&
    				<View style={{flex: 1, marginRight: 10, alignItems: 'flex-end'}}>
    					<Text onPress={() => onChange(moment(value).subtract(1, 'weeks').format('YYYY-MM-DD'))}>
    			    	<Icon name="ios-arrow-back" size={32} color="#f18d1a"/>
    			    </Text>
    			  </View>
    			}*/}

            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#c5c5c5',
              padding: 20,
              borderRadius: 4
            }}>
              <FontAwesomeIcon
                name="calendar"
                size={24}
                style={[styles.orange_color]}
              />
              <Text onPress={(e) => {
                if (!readonly) {
                  showDatepicker()
                }
              }}
                    style={{fontSize: 11, color: fontColor, marginLeft: 5}}
              >
                {i18nMoment.format("YYYY-MM-DD HH:mm A")}
              </Text>
            </View>

            {/*{
    				needWeekFilter &&
        		<View style={{flex: 1, marginLeft: 10}}>
							<Text onPress={() => onChange(moment(value).add(1, 'weeks').format('YYYY-MM-DD'))}>
    						<Icon name="ios-arrow-forward" size={32} color="#f18d1a"/>
    					</Text>
    				</View>
    			}*/}
          </View>
        </View>
      </View>
    )
  }
}
