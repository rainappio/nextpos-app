import React, {Component} from 'react'
import {Modal, Text, TouchableOpacity, View} from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment-timezone'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import TimeZoneService from "../helpers/TimeZoneService";
import {withContext} from "../helpers/contextHelper";

class RenderDatePicker extends Component {
	static contextType = LocaleContext

	render() {
		const {
			input: {onBlur, onChange, onFocus, value},
			placeholder,
			meta: {error, toched, vali5d},
			isShow,
			showDatepicker,
			readonly,
			themeStyle,
			...rest
		} = this.props
		const {t, locale} = this.context

		const timezone = TimeZoneService.getTimeZone()
		const i18nMoment = moment(value).tz(timezone);

		if (locale === 'zh-Hant-TW') {
			i18nMoment.locale('zh-tw')
		} else {
			i18nMoment.locale('en')
		}

		const fontColor = readonly ? '#c5c5c5' : themeStyle.color

		return (
			<View style={{flex: 1}}>
				<View>
					{Platform.OS === 'ios' ? <Modal transparent={true}
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

									onChange(new Date(e.nativeEvent?.timestamp ?? value))
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
					</Modal> :
						isShow && <RNDateTimePicker
							testID="dateTimePicker"
							value={value}
							mode={"date"}
							is24Hour={true}
							display="calendar"
							onChange={(e, selectedDate) => {
								console.log(`on change date: ${selectedDate} ${e.nativeEvent.timestamp}`)
								showDatepicker();
								onChange(new Date(e.nativeEvent?.timestamp ?? value))

							}}
						/>
					}

				</View>
				<View>
					<View style={[styles.flex_dir_row, styles.jc_alignIem_center]}>
						<View style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							borderWidth: 1,
							borderColor: '#c5c5c5',
							paddingVertical: 10,
							paddingHorizontal: 5,
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
								{i18nMoment.tz(timezone).format("YYYY-MM-DD HH:mm A")}
							</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

export default withContext(RenderDatePicker)
