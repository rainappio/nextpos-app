import React from 'react'
import {View} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import NavigationService from "../navigation/NavigationService";
import {Ionicons} from '@expo/vector-icons';

class InventoryScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
    }



    render() {
        const {themeStyle} = this.props
        const {t, customMainThemeColor} = this.context

        return (
            <ThemeContainer>
                <View style={styles.fullWidthScreen}>
                    <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('inventory.title')}
                    />

                    <View style={[styles.flex(1)]}>
                        <View style={[styles.menuContainer]}>
                            <MenuButton
                                route='InventoryOrderScreen'
                                onPress={() => NavigationService?.navigateToRoute('InventoryOrderScreen')}
                                title={t('inventory.title')}
                                icon={
                                    <Ionicons
                                        name="list"
                                        size={40}
                                        style={[styles?.buttonIconStyle(customMainThemeColor)]}
                                    />
                                } />
                            <View style={styles.dynamicHorizontalPadding(6)} />
                            <View style={{flex: 1}}></View>
                        </View>

                        <View style={[styles.menuContainer]}>
                            <View style={{flex: 1}}></View>
                            <View style={styles.dynamicHorizontalPadding(6)} />
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={[styles.menuContainer]}>
                            <View style={{flex: 1}}></View>
                            <View style={styles.dynamicHorizontalPadding(6)} />
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={[styles.menuContainer]}>
                            <View style={{flex: 1}}></View>
                            <View style={styles.dynamicHorizontalPadding(6)} />
                            <View style={{flex: 1}}></View>
                        </View>
                    </View>
                </View>
            </ThemeContainer>
        )
    }
}

export default withContext(InventoryScreen)
