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
    const {handleSubmit} = this.props

    return (
      <TimeCardFilterForm handleSubmit={handleSubmit} />
    )
  }
}

export const StaffTimeCardFilterForm = reduxForm({
  form: 'staffTimeCardFilterForm'
})(StaffTimeCardFilterFormBase)


export const UserTimeCardFilterForm = reduxForm({
  form: 'userTimeCardFilterForm'
})(StaffTimeCardFilterFormBase)
