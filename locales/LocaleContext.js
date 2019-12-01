import * as Localization from 'expo-localization'
import React from 'react'

export const LocaleContext = React.createContext({
  locale: Localization.locale,
  localeResource: {},
  localize: () => {}
})
