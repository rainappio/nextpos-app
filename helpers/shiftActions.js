import {api, dispatchFetchRequest, dispatchFetchRequestWithOption, successMessage, warningMessage} from "../constants/Backend";
import i18n from 'i18n-js'
import NavigationService from "../navigation/NavigationService";

export const handleOpenShift = (balance, successCallback) => {
  if (!checkBalanceInput(balance)) {
    return
  }

  dispatchFetchRequest(
    api.shift.open,
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        balance: balance
      })
    },
    response => {
      successMessage(i18n.t('shift.shiftOpened'))
      successCallback(response)
    }
  ).then()
}

export const handleCloseShift = (balance, successCallback) => {
  if (!checkBalanceInput(balance)) {
    return
  }

  dispatchFetchRequest(
    api.shift.close,
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        balance: balance
      })
    },
    response => {
      successCallback(response)
    }).then()
}

export const checkBalanceInput = (balance) => {
  if (balance <= 0) {
    warningMessage(i18n.t('errors.balanceError'))
  }

  return balance > 0
}

export const handleinitiateCloseShift = () => {
  dispatchFetchRequest(
    api.shift.initiate,
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    },
    response => {
      successCallback(response)
    }).then()
}

export const handleConfirmCloseShift = (values) => {
  dispatchFetchRequest(
    api.shift.confirm,
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        body: values.closingRemark
      })
    },
    response => {
      successCallback(response)
    }).then()
}

export const handleAbortCloseShift = () => {
  dispatchFetchRequestWithOption(api.shift.abort, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    }, {
      defaultMessage: false
    },
    response => {
      successMessage(i18n.t('shift.shiftAborted'))
      NavigationService.navigate('ShiftClose')
    }).then()
}

export const renderShiftStatus = (status) => {
  return i18n.t(`shift.status.${status}`)
}
