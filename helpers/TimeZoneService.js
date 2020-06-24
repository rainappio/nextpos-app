let _clientFunction

function setClientReference(clientFunction) {
  _clientFunction = clientFunction
}

function getTimeZone() {

  if (_clientFunction != null) {
    return _clientFunction().data.timezone
  }

  // todo: maybe should raise a warning.
  return 'Asia/Taipei'
}

export default {
  setClientReference,
  getTimeZone
}
