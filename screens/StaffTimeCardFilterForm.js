import React from 'react'
import {reduxForm} from 'redux-form'
import {LocaleContext} from '../locales/LocaleContext'
import TimeCardFilterForm from './TimeCardFilterForm'

class StaffTimeCardFilterForm extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {handleSubmit} = this.props

    return (
      <TimeCardFilterForm handleSubmit={handleSubmit}/>
    )
  }
}

StaffTimeCardFilterForm = reduxForm({
  form: 'staffTimeCardFilterForm'
})(StaffTimeCardFilterForm)

export default StaffTimeCardFilterForm
