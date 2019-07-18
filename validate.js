const customValidate = values => {
  const errors = {}
  if (!values.clientName) {
    errors.clientName = 'This information is required'
  }
  if (!values.username) {
    errors.username = 'This information is required'
  }
  if (!values.confirmusername) {
    errors.confirmusername = 'This information is required'
  }
  if (!values.masterPassword) {
    errors.masterPassword = 'This information is required'
  }
  if (values.username !== values.confirmusername) {
    errors.confirmusername = 'Please use same email for username'
  }
  return errors
}

export default customValidate
