import React from 'react'
import CreateAccFormScreen from './CreateAccFormScreen'

class CreateAccScreen extends React.Component {
  handleSubmit = values => {
    fetch('http://35.234.63.193/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then(response => {
        if (!response.ok) {
          alert('username already taken')
        } else {
          this.props.navigation.navigate('Login')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }
  render() {
    return <CreateAccFormScreen onSubmit={this.handleSubmit} />
  }
}

export default CreateAccScreen
