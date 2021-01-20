import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {getTableLayout, getTableLayouts} from '../actions'
import TableForm from './TableForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";

class TableAddModal extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
    }

    handleSubmit = values => {
        const layoutId = this.props?.layoutId

        dispatchFetchRequest(api.tablelayout.createTable(layoutId), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }, response => {
            this.props.closeModal()
            this.props?.setLoading()
            this.props.getTableLayouts()
        }).then()
    }

    render() {
        const {navigation} = this.props
        const {t} = this.context

        return (
            <ThemeContainer>
                <View style={[styles.fullWidthScreen, {marginTop: 0}]}>
                    <ScreenHeader title={t('addTableTitle')}
                        parentFullScreen={true}
                        backAction={() => this.props.closeModal()}
                    />

                    <TableForm onSubmit={this.handleSubmit} navigation={{goBack: () => this.props.closeModal()}} />
                </View>
            </ThemeContainer>
        )
    }
}

const mapStateToProps = state => ({
    tablelayout: state.tablelayout.data
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getTableLayout: id => dispatch(getTableLayout(id)),
    getTableLayouts: () => dispatch(getTableLayouts())
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableAddModal)
