import {api, dispatchFetchRequest, successMessage} from "../constants/Backend";
import NavigationService from "../navigation/NavigationService";

export const handleOrderSubmit = id => {
  const formData = new FormData()
  formData.append('action', 'SUBMIT')

  dispatchFetchRequest(
    api.order.process(id),
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
      body: formData
    },
    response => {
      response.json().then(data => {
        if (data.hasOwnProperty('orderId')) {
          successMessage('Order submitted')
          NavigationService.navigate('TablesSrc')
        }
      })
    }
  ).then()
}

export const handleDelete = id => {
  dispatchFetchRequest(
    api.order.delete(id),
    {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    response => {
      successMessage('Deleted')
      NavigationService.navigate('TablesSrc')
    }
  ).then()
}
