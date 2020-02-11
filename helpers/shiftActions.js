import {api, dispatchFetchRequest, warningMessage} from "../constants/Backend";
import i18n from 'i18n-js'

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

const checkBalanceInput = (balance) => {
  if (balance <= 0) {
    warningMessage(i18n.t('errors.balanceError'))
  }

  return balance > 0
}
