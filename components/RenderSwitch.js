import React from 'react'
import { List, Switch } from '@ant-design/react-native'

export default class RenderSwitch extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      meta: { error, toched, valid },
      ...rest
    } = this.props

    return <Switch checked={value} onChange={onChange} {...rest} />
  }
}
