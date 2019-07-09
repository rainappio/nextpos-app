import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';

export class InputText extends React.Component {

	constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  render() {
    return (
			<View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder={this.props.placeholder}
          onChangeText={(text) => this.setState({text})}
          secureTextEntry={this.props.secureTextEntry}
        />
      </View>
    	)
  }
}
