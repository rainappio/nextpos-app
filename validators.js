import validator from 'validator'
import i18n from 'i18n-js'
import {currentLocale} from './App'

export const isRequired = value =>
  value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
    ? i18n.t('errors.required', {locale: currentLocale})
    : undefined

export const isEmail = value =>
  value && !validator.isEmail(value)
    ? i18n.t('errors.email', {locale: currentLocale})
    : undefined

export const isvalidPassword = value =>
  value && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/.test(value)
    ? i18n.t('errors.clientPassword', {locale: currentLocale})
    : undefined

export const isconfirmPassword = (value, allValues, props, name) => {
  return value && value === allValues?.masterPassword
    ? undefined
    : i18n.t('errors.confirmPassword', {locale: currentLocale})
}

export const isURL = value =>
  value &&
    !validator.isURL(value, {
      protocols: ['http', 'https'],
      require_protocol: true
    })
    ? 'Please enter a valid and complete URL'
    : undefined

export const isAcceptRage = value =>
  value && (parseInt(value, 10) < 0 || parseInt(value, 10) > 100)
    ? 'A Range must be between 0 and 100'
    : undefined

export const isPercentage = value =>
  value &&
    (parseFloat(value).toFixed(2) < 0.01 || parseFloat(value).toFixed(2) > 0.99)
    ? i18n.t('errors.percentage', {locale: currentLocale})
    : undefined

export const isCountZero = value =>
  value === 0 ? i18n.t('errors.moreThanZero', {locale: currentLocale}) : undefined


export const isTwoBigWords = val => {
  if (!val || val?.length !== 2 || !/^[A-Z]*$/.test(val)) {
    return i18n.t('errors.requireTwoUppercaseLetters', {locale: currentLocale})
  }
  else
    return undefined
}

export const isNDigitsNumber = (n) => (value) => {
  if (!value || value?.length !== n || isNaN(value)) {
    return i18n.t('errors.requireNDigitsNumber', {n: n})
  }
  else
    return undefined
}

export const isPositiveInteger = value => {
  return (value >= 0) ? undefined : i18n.t('errors.moreThanZero', {locale: currentLocale})
}

