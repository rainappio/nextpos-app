import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import ScreenHeader from "../components/ScreenHeader"
import {LocaleContext} from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import {getCurrentClient} from '../actions/client'
import LoadingScreen from "./LoadingScreen"
import styles from '../styles'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest} from '../constants/Backend'

class EinvoiceSettingScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        this.state = {

        }
    }

    componentDidMount() {

        this.props.getCurrentClient()
        !!this.props?.client?.attributes?.UBN && this.getEinvoice(this.props?.client?.attributes?.UBN)
        this._refreshScreen = this.props.navigation.addListener('focus', () => {
            this.refreshScreen()
        })
    }
    componentWillUnmount() {
        this._refreshScreen()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props?.client !== prevProps?.client) {
            this.refreshScreen()
        }
    }

    refreshScreen = () => {
        !!this.props?.client?.attributes?.UBN && this.getEinvoice(this.props?.client?.attributes?.UBN)
    }

    getEinvoice = (ubn) => {

        dispatchFetchRequest(api.eInvoice.getAllByUbn(ubn), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                this.setState({eInvoiceData: data?.results ?? []})
            })
        }).then()
    }

    Item = (item) => {
        return (
            <View style={styles.rowFront}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('EinvoiceEditScreen', {
                            data: item,
                            refreshScreen: () => {this.refreshScreen()},
                        })
                    }}
                >
                    <StyledText style={styles.rowFrontText}>{item?.rangeIdentifier}</StyledText>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {navigation, offers, isLoading} = this.props
        const {t} = this.context

        if (isLoading) {
            return (
                <LoadingScreen />
            )
        }
        return (
            <ThemeScrollView>
                <View style={[styles.fullWidthScreen]}>
                    <ScreenHeader title={t('eInvoice.eInvoiceTitle')}
                        parentFullScreen={true}
                        rightComponent={
                            <AddBtn
                                onPress={() => navigation.navigate('EinvoiceEditScreen', {data: null, refreshScreen: this.refreshScreen, })}
                            />}
                    />
                    <FlatList
                        data={this?.state?.eInvoiceData ?? []}
                        renderItem={({item}) => this.Item(item)}
                        keyExtractor={(item) => item?.rangeIdentifier}
                        ListEmptyComponent={
                            <View>
                                <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                            </View>
                        }
                    />
                </View>
            </ThemeScrollView>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.offers.loading,
    client: state.client.data,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient())
})

export default connect(mapStateToProps, mapDispatchToProps)(EinvoiceSettingScreen)
