import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import PrinterForm from '../screens/PrinterForm'
import { getWorkingAreas, getPrinters } from '../actions'
import { api, makeFetchRequest } from '../constants/Backend'
import styles from '../styles'

class PrinterAdd extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = (values) => {
  	makeFetchRequest(token => {
    fetch(api.printer.create,{
      	method: 'POST',
      	withCredentials: true,
      	credentials: 'include',
      	headers: {
        	'Content-Type': 'application/json',
        	'x-client-id': token.application_client_id,
        	Authorization: 'Bearer ' + token.access_token
      	},
      	body: JSON.stringify(values)
    	})
    	.then(response => {
    		if(response.status === 200){    			
					this.props.navigation.navigate('PrinternKDS')
					this.props.getWorkingAreas()
					this.props.getPrinters()
    		}else{
    			alert('pls try again')
    		}
      })
      .catch(error =>{ 
      	console.error(error)
      })
    })
  }


  render() {
  	const { navigation } = this.props
  	const { t } = this.props.screenProps
  	
    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('settings.workingArea')}
            </Text>
            <PrinterForm
							navigation={navigation}
							onSubmit={this.handleSubmit}
            />
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
	printers: state.printers.data.printers,
	workingareas: state.workingareas.data.workingAreas
})
const mapDispatchToProps = (dispatch) => ({
	dispatch,
	getPrinters: () => dispatch(getPrinters()),
	getWorkingAreas: () => dispatch(getWorkingAreas())
})

export default connect(mapStateToProps, mapDispatchToProps)(PrinterAdd)
