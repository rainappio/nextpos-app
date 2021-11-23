import React from 'react'
import {reduxForm} from 'redux-form'
import {LocaleContext} from '../locales/LocaleContext'
import TimeCardFilterForm from './TimeCardFilterForm'

class StaffTimeCardFilterFormBase extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {onChange, handleSubmit, handleExport} = this.props

    return (
      <TimeCardFilterForm onChange={onChange} handleSubmit={handleSubmit} handleExport={handleExport}/>
    )
  }
}

export const StaffTimeCardFilterForm = reduxForm({
  form: 'staffTimeCardFilterForm'
})(StaffTimeCardFilterFormBase)


export const UserTimeCardFilterForm = reduxForm({
  form: 'userTimeCardFilterForm'
})(StaffTimeCardFilterFormBase)
