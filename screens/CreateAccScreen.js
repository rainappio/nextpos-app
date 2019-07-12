import React from 'react';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import HomeScreen from './HomeScreen';
import CreateAccFormScreen from './CreateAccFormScreen';


class CreateAccScreen extends React.Component {

  handleSubmit = (values) => {
		//console.warn('handleSubmit hit');
		console.warn(values)

		// fetch('http://35.234.63.193/clients', {
  //     method: 'POST', // or 'PUT'
  //     headers:{
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(values) // data can be `string` or {object}!
  //     })
  //     .then(response => {
  //     	console.log(response);
  //     })
  //     //.then(() => dispatch(push(SDLIST_ROUTE)))
  //     .catch(error => {
  //       this.setState({
  //         isSaving: false,
  //         hasError: true
  //       });
  //     })
	}

  render() {
    return (    	
      <CreateAccFormScreen onSubmit={this.handleSubmit}/>
    );
  }
}

export default CreateAccScreen;
