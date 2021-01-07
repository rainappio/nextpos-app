import {Text, TouchableOpacity, View} from "react-native";
import styles from "../styles";
import moment from "moment";
import 'moment/locale/zh-tw'
import Icon from "react-native-vector-icons/Ionicons";
import SegmentedControl from "./SegmentedControl";
import React from "react";
import {LocaleContext} from "../locales/LocaleContext";
import {StyledText} from "./StyledText";

export default class TimePeriodPicker extends React.Component {

    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context);

        this.state = {
            currentDate: this.props.currentDate,
            filterTypes: {
                0: {label: context.t('monthPicker.month'), value: 'M'},
                1: {label: context.t('monthPicker.year'), value: 'y'}
            }
        }
    }

    componentDidMount() {
        this.props.handleDateChange(moment(this.props.currentDate))
    }



    navigatePrevious = () => {
        const key = this.props?.selectedFilter

        const updated = moment(this.state.currentDate).subtract(1, key)
        this.setState({currentDate: updated})

        this.props.handleDateChange(updated)
    }

    navigateNext = () => {
        const key = this.props?.selectedFilter

        const updated = moment(this.state.currentDate).add(1, key)
        this.setState({currentDate: updated})

        this.props.handleDateChange(updated)
    }

    render() {
        const {locale} = this.context
        const i18nMoment = moment(this.state.currentDate);
        const i18nMomentWeek = moment(this.state.currentDate).add(6, 'days');

        if (locale === 'zh-Hant-TW') {
            i18nMoment.locale('zh-tw')
        } else {
            i18nMoment.locale('en')
        }

        return (
            <View style={{alignItems: 'center'}}>
                <View style={[styles.tableRowContainer, {maxWidth: 640}]}>
                    <View style={[styles.tableCellView, {flex: 1, marginRight: 10, justifyContent: 'flex-end'}]}>
                        <TouchableOpacity
                            hitSlop={{left: 50, right: 5}}
                            onPress={() => this.navigatePrevious()}
                        >
                            <Text>
                                <Icon name="chevron-back" size={32} color="#f18d1a" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[{flex: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}]}>
                        {this.props?.selectedFilter === 'months' && <StyledText style={styles.sectionTitleText}>{i18nMoment.format('YYYY-MM')}</StyledText>}
                        {this.props?.selectedFilter === 'weeks' && <>
                            <StyledText style={styles.sectionTitleText}>{i18nMoment.format('YYYY-MM-DD')}</StyledText>
                            <StyledText style={styles.sectionTitleText}> ~ </StyledText>
                            <StyledText style={styles.sectionTitleText}>{i18nMomentWeek.format('YYYY-MM-DD')}</StyledText></>}
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, marginLeft: 10}]}>
                        <TouchableOpacity
                            style={{flex: 1}}
                            hitSlop={{left: 5, right: 50}}
                            onPress={() => this.navigateNext()}
                        >
                            <Text>
                                <Icon name="chevron-forward" size={32} color="#f18d1a" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }

}
