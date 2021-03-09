import React from 'react'
import {Text, View} from 'react-native'
import {CheckBox} from 'react-native-elements'
import IonIcon from 'react-native-vector-icons/Ionicons'
import styles from "../styles";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "./StyledText";
import DropDownPicker from 'react-native-dropdown-picker';

class IconDropDown extends React.Component {

    render() {
        const {
            input: {onBlur, onChange, onFocus, value},
            isEdit,
            meta: {error, touched, valid},
            themeStyle,
            locale: {customMainThemeColor},
            ...rest
        } = this.props

        return (
            <DropDownPicker
                items={[
                    {label: 'ios-attach', value: 'ios-attach', icon: () => <IonIcon name="ios-attach" size={26} color={customMainThemeColor} />},
                    {label: 'ios-newspaper', value: 'ios-newspaper', icon: () => <IonIcon name="ios-newspaper" size={26} color={customMainThemeColor} />},
                    {label: 'ios-notifications', value: 'ios-notifications', icon: () => <IonIcon name="ios-notifications" size={26} color={customMainThemeColor} />},
                    {label: 'chatbox-ellipses-sharp', value: 'chatbox-ellipses-sharp', icon: () => <IonIcon name="chatbox-ellipses-sharp" size={26} color={customMainThemeColor} />},
                    {label: 'md-today', value: 'md-today', icon: () => <IonIcon name="md-today" size={26} color={customMainThemeColor} />},
                ]}
                showArrow={false}
                defaultValue={!!value ? value : 'ios-attach'}
                containerStyle={{flex: 1, }}
                style={{backgroundColor: '#fafafa', ...themeStyle, justifyContent: 'center'}}
                itemStyle={{
                    justifyContent: 'center'
                }}
                labelStyle={{
                    display: 'none'
                }}
                dropDownMaxHeight={250}
                dropDownStyle={themeStyle}
                onChangeItem={item => onChange(item.value)}
            />
        )
    }
}

export default withContext(IconDropDown)
