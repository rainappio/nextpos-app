import validator from 'validator'

export const isRequired = value =>
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)
    ? 'This information is required'
    : undefined

export const isEmail = value =>
  value && !validator.isEmail(value)
    ? 'Please use a valid email address'
    : undefined

export const isvalidPassword = value =>
  value && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/.test(value)
    ? 'Password must have at least one Char and one digit and length 6'
    : undefined

export const isPhoneNumber = value =>
  value && !/^\+?[0-9 -]+$/.test(value)
    ? 'Please enter a valid phone number'
    : undefined

export const isFacebookURL = value => {
  if (!value) {
    return undefined
  }

  if (!/^https:\/\/www.facebook.com\/.+/.test(value)) {
    return 'A facebook URL must start with https://www.facebook.com/'
  }

  return isURL(value)
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
  (parseFloat(value).toFixed(2) < 0 || parseFloat(value).toFixed(2) > 100)
    ? 'A percentage must be between 0 and 100'
    : undefined

export const isValidDateRange = value =>
  value === undefined ? 'This information is required' : undefined

export const fieldValidate = values => {
  const errors = {}
  if (!values.clientName) {
    errors.clientName = 'Required'
  }
  if (!values.username) {
    errors.username = 'Required'
  }
  if (!values.confirmusername) {
    errors.confirmusername = 'Required'
  }
  if (!values.masterPassword) {
    errors.masterPassword = 'Required'
  }
  if (values.username !== values.confirmusername) {
    errors.confirmusername = 'Please use same username'
  }
  return errors
}
