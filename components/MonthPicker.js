import {Text, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import moment from "moment";
import 'moment/locale/zh-tw'
import Icon from "react-native-vector-icons/Ionicons";
import SegmentedControl from "./SegmentedControl";
import React from "react";
import {LocaleContext} from "../locales/LocaleContext";
import {StyledText} from "./StyledText";

export default class MonthPicker extends React.Component {

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      currentDate: this.props.currentDate,
      selectedFilter: this.props.selectedFilter,
      filterTypes: {
        0: {label: context.t('monthPicker.month'), value: 'M'},
        1: {label: context.t('monthPicker.year'), value: 'y'}
      }
    }
  }

  handleFilterChange = (index) => {
    this.setState({selectedFilter: index})
  }

  navigatePrevious = () => {
    const key = this.state.filterTypes[this.state.selectedFilter].value

    const updated = moment(this.state.currentDate).subtract(1, key)
    this.setState({currentDate: updated})

    this.props.handleMonthChange(updated, this.state.selectedFilter)
  }

  navigateNext = () => {
    const key = this.state.filterTypes[this.state.selectedFilter].value

    const updated = moment(this.state.currentDate).add(1, key)
    this.setState({currentDate: updated})

    this.props.handleMonthChange(updated, this.state.selectedFilter)
  }

  render() {
    const {locale, customMainThemeColor} = this.context
    const i18nMoment = moment(this.state.currentDate);

    if (locale === 'zh-Hant-TW') {
      i18nMoment.locale('zh-tw')
    } else {
      i18nMoment.locale('en')
    }

    return (
      <View>
        <View style={[styles.sectionTitleContainer]}>
          <StyledText style={styles.sectionTitleText}>{i18nMoment.format('MMMM, YYYY')}</StyledText>
        </View>
        <View style={styles.tableRowContainer}>
          <View style={[styles.tableCellView, {flex: 1, marginRight: 10, justifyContent: 'flex-end'}]}>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 50, right: 5}}
              onPress={() => this.navigatePrevious()}
            >
              <Text>
                <Icon name="chevron-back" size={32} color={customMainThemeColor} />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[{flex: 3, justifyContent: 'center'}]}>
            <SegmentedControl
              selectedIndex={this.state.selectedFilter}
              input={{
                onChange: this.handleFilterChange
              }}
              values={Object.keys(this.state.filterTypes).map(key => this.state.filterTypes[key].label)}
              normalize={value => {
                return this.state.filterTypes[value].value
              }}
            />
          </View>
          <View style={[styles.tableCellView, {flex: 1, marginLeft: 10}]}>
            <TouchableOpacity
              style={{flex: 1}}
              hitSlop={{top: 20, bottom: 20, left: 5, right: 50}}
              onPress={() => this.navigateNext()}
            >
              <Text>
                <Icon name="chevron-forward" size={32} color={customMainThemeColor} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )

  }

}
